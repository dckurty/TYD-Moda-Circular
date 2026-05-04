import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook de Mercado Pago recibido:", body);
    
    // Aquí se actualizaría en base de datos el estado del pedido a Pagado (si aplica)
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}
