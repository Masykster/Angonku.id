<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Distributor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    /**
     * Display marketplace product catalog with category filter.
     */
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');
        $search = $request->query('search');

        $query = Product::with(['distributor', 'drugReference'])->where('stock', '>', 0);

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('distributor', function ($dq) use ($search) {
                      $dq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $products = $query->orderBy('category')->orderBy('name')->get();

        $distributors = Distributor::withCount('products')->get();

        $userOrders = Order::where('user_id', Auth::id())
            ->with(['items.product.distributor'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Marketplace/Index', [
            'products' => $products,
            'distributors' => $distributors,
            'selectedCategory' => $category,
            'searchQuery' => $search,
            'myOrders' => $userOrders,
        ]);
    }

    /**
     * Display checkout summary page.
     */
    public function checkout(Request $request)
    {
        return Inertia::render('Marketplace/Checkout');
    }

    /**
     * Store a new marketplace order with 5% platform commission calculation.
     */
    public function storeOrder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'shipping_address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::user();

        return DB::transaction(function () use ($validated, $user) {
            $totalAmount = 0;
            $itemsToCreate = [];

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    return redirect()->back()->withErrors([
                        'message' => "Stok produk {$product->name} tidak mencukupi (sisa: {$product->stock})."
                    ]);
                }

                $subtotal = (float) $product->price * (int) $item['quantity'];
                $totalAmount += $subtotal;

                // Reduce stock
                $product->decrement('stock', $item['quantity']);

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ];
            }

            // Calculate 5% platform take-rate commission
            $platformCommission = round($totalAmount * 0.05, 2);
            $netToDistributor = round($totalAmount - $platformCommission, 2);

            $orderCode = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));

            $order = Order::create([
                'user_id' => $user->id,
                'order_code' => $orderCode,
                'total_amount' => $totalAmount,
                'platform_commission' => $platformCommission,
                'net_to_distributor' => $netToDistributor,
                'status' => 'paid', // Auto confirm demo
                'payment_method' => $validated['payment_method'],
                'shipping_address' => $validated['shipping_address'] ?? ($user->farms->first()?->address ?? 'Alamat Kandang Utama'),
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($itemsToCreate as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            return redirect()->route('marketplace')->with('success', "Pesanan #{$orderCode} berhasil dibuat! Total: Rp " . number_format($totalAmount, 0, ',', '.') . " (Komisi Platform 5%: Rp " . number_format($platformCommission, 0, ',', '.') . ").");
        });
    }
}
