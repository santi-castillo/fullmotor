import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política publicitaria',
  description:
    'Cómo funciona la publicidad en TodoMotor Uruguay: qué rotulamos, qué no vendemos y cómo medimos las campañas.',
  alternates: { canonical: '/politica-publicitaria' },
}

export const dynamic = 'force-static'

/**
 * Public advertising policy.
 *
 * This page does double duty. It is the consumer-facing disclosure the Ley
 * 17.250 asks for, and it is the sales argument: a ranking that cannot be
 * bought is only worth something if the promise is public and costly to walk
 * back. Putting "we do not sell the Top 3" in writing is what makes it true.
 */
export default function PoliticaPublicitariaPage() {
  return (
    <div className="art">
      <h1 className="art__title">Política publicitaria</h1>
      <div className="blog-content" style={{ marginTop: 'var(--space-7)' }}>
        <p>
          TodoMotor se financia con publicidad. Para que eso no erosione la utilidad del sitio, estas son las
          reglas con las que trabajamos. Son públicas a propósito: si las cambiamos, se nota.
        </p>

        <h2>1. Todo lo pago está rotulado</h2>
        <p>
          Cada espacio publicitario lleva la palabra <strong>Publicidad</strong> visible, y cada artículo pago
          lleva <strong>Contenido patrocinado por [marca]</strong> arriba del título, no al pie. Nunca vas a
          tener que adivinar si algo se pagó.
        </p>

        <h2>2. La guía de compra no se vende</h2>
        <p>
          Es la regla que más nos importa. El ranking de la guía surge de las fichas técnicas, de los precios
          de referencia y de los datos de ventas de ACAU. <strong>Ningún anunciante puede comprar una posición
          en el podio, en el listado de alternativas, ni un punto de afinidad.</strong>
        </p>
        <p>
          No es solo una promesa: está garantizado en cómo está construido el sitio. El sistema que decide qué
          avisos mostrar y el que calcula el ranking son módulos separados que no se comunican. No existe un
          camino por el cual un pago mueva un modelo de lugar.
        </p>
        <p>
          Sí se puede comprar un <em>espacio</em> dentro de los resultados de la guía, segmentado por lo que
          respondiste. Ese espacio está rotulado, se ve claramente distinto de los modelos recomendados, y
          aclara que no participa del ranking.
        </p>

        <h2>3. El contenido editorial lo decidimos nosotros</h2>
        <p>
          Un anunciante no elige qué cubrimos ni cómo. Un artículo patrocinado se escribe con nuestro criterio
          editorial y nuestra voz; no publicamos comunicados de prensa pegados tal cual. Si una marca no está
          de acuerdo con el enfoque, puede no publicar — pero no reescribe la nota.
        </p>
        <p>
          Los enlaces pagos llevan <code>rel=&quot;sponsored&quot;</code>, como pide Google. No vendemos
          enlaces para posicionamiento.
        </p>

        <h2>4. Qué no aceptamos</h2>
        <ul>
          <li>Avisos que imiten el diseño del contenido editorial o de las fichas de vehículos.</li>
          <li>Formatos que tapen el contenido: pop-ups, interstitials o expandibles sobre la página.</li>
          <li>Audio o video que arranque solo con sonido.</li>
          <li>Publicidad de terceros que instale cookies sin que el visitante haya aceptado.</li>
          <li>Avisos engañosos sobre precio, disponibilidad o características de un vehículo.</li>
        </ul>

        <h2>5. Cómo medimos</h2>
        <p>
          A los anunciantes les entregamos un reporte con impresiones, clics, CTR y distribución por día,
          sección y dispositivo. Dos aclaraciones que hacemos siempre por adelantado:
        </p>
        <ul>
          <li>
            Una <strong>impresión</strong> se cuenta cuando al menos la mitad del aviso estuvo visible en
            pantalla durante un segundo continuo, siguiendo el estándar del MRC. No contamos avisos que se
            cargaron pero nadie llegó a ver.
          </li>
          <li>
            El <strong>tráfico no humano</strong> (buscadores, rastreadores, automatizaciones) se detecta, se
            informa en una línea aparte del reporte y <strong>no se factura</strong>.
          </li>
        </ul>
        <p>
          Si el anunciante mide con su propio ad server, es normal que haya una diferencia de entre 5% y 20%
          respecto de nuestros números, por cómo cada sistema cuenta el momento de la impresión y por los
          bloqueadores de publicidad. Lo acordamos por escrito antes de arrancar, no después.
        </p>

        <h2>6. Privacidad</h2>
        <p>
          Nuestra publicidad es contextual: depende de la página, no de la persona. No armamos perfiles, no te
          seguimos entre sitios y no vendemos datos. El detalle completo está en la{' '}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>

        <h2>¿Querés anunciar?</h2>
        <p>
          Escribinos a <a href="mailto:contacto@todomotor.uy">contacto@todomotor.uy</a> y te mandamos el
          tarifario con formatos, ubicaciones y precios.
        </p>
      </div>
    </div>
  )
}
