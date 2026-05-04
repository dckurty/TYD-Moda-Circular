import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(req: Request) {
  try {
    const access_token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!access_token) {
      // Para desarrollo/pruebas si no hay token configurado
      return NextResponse.json({ error: "Falta token de MercadoPago en las variables de entorno" }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken: access_token });
    const body = await req.json();
    const { items, payer } = body;

    const preference = new Preference(client);
    
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: "CLP",
        })),
        payer: {
          email: payer.email,
          name: payer.name,
          surname: payer.surname,
        },
        back_urls: {
          success: `${baseUrl}/success`,
          failure: `${baseUrl}/failure`,
          pending: `${baseUrl}/checkout`
        },
        auto_return: "approved",
      }
    });

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error("Error creating reference:", error);
    return NextResponse.json({ error: "Error al generar preferencia de MercadoPago" }, { status: 500 });
  }
}
