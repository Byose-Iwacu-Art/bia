import { NextRequest, NextResponse } from 'next/server';
import client from '../db';

async function ensureTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    )
  `);
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const user_id = req.nextUrl.searchParams.get('user_id');
    if (!user_id) return NextResponse.json({ message: 'user_id required' }, { status: 400 });

    const result = await client.query(
      `SELECT c.product_id, p.name, p.image, p.price, c.quantity
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [user_id]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const { user_id, product_id, quantity } = await req.json();
    if (!user_id || !product_id) return NextResponse.json({ message: 'user_id and product_id required' }, { status: 400 });

    const qty = Math.max(1, Number(quantity) || 1);
    await client.query(
      `INSERT INTO cart (user_id, product_id, quantity, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = $3, updated_at = CURRENT_TIMESTAMP`,
      [user_id, product_id, qty]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable();
    const { user_id, product_id } = await req.json();
    if (!user_id) return NextResponse.json({ message: 'user_id required' }, { status: 400 });

    if (product_id) {
      await client.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
    } else {
      await client.query('DELETE FROM cart WHERE user_id = $1', [user_id]);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting from cart' }, { status: 500 });
  }
}
