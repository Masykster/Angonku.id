<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DistributorOrderController extends Controller
{
    /**
     * Display listing of distributor orders.
     */
    public function index(Request $request)
    {
        $orders = Order::with(['user', 'items.product.distributor'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Marketplace/Orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Update status of an order.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,processing,completed,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
