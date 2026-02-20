import { NextRequest, NextResponse } from 'next/server';
import client from '../db';

async function ensureTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    )
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS promotion (
      id SERIAL PRIMARY KEY,
      product_id TEXT NOT NULL,
      promotion NUMERIC(5,2) NOT NULL DEFAULT 0,
      promotion_type TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(product_id)
    )
  `);
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const user_id = req.nextUrl.searchParams.get('user_id');
    if (!user_id) return NextResponse.json({ message: 'user_id required' }, { status: 400 });

    const result = await client.query(
      `SELECT w.product_id, p.name, p.image, p.price, p.hashed_id,
              COALESCE(pr.promotion, 0) AS promotion
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       LEFT JOIN promotion pr ON pr.product_id = CAST(p.id AS TEXT) AND pr.status = 'active'
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [user_id]
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('[wishlist GET]', error?.message ?? error);
    return NextResponse.json({ message: 'Error fetching wishlist', error: error?.message }, { status: 500 });
  }
}

// Toggle: adds if not present, removes if present
export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const { user_id, product_id } = await req.json();
    if (!user_id || !product_id) return NextResponse.json({ message: 'user_id and product_id required' }, { status: 400 });

    const existing = await client.query(
      'SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );
    if (existing.rows.length > 0) {
      await client.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
      return NextResponse.json({ wishlisted: false });
    } else {
      await client.query('INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)', [user_id, product_id]);
      return NextResponse.json({ wishlisted: true });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error toggling wishlist' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable();
    const { user_id, product_id } = await req.json();
    if (!user_id || !product_id) return NextResponse.json({ message: 'user_id and product_id required' }, { status: 400 });

    await client.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error removing from wishlist' }, { status: 500 });
  }
}
