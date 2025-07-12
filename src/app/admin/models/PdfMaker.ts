import { variable64 } from "../../../assets/img";
import { inte } from "../../../assets/inte";
import { bcp } from "../../../assets/bcp";
import { bbva } from "../../../assets/bbva";
import { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";

type Cotizacion = {
  product: {
    codigo: string;
    descripcion: string;
    NOMBRE: string;
    VENTA_SOLES: number;
    precio_caja?: number;
    precio_docena?: number;
    precio_unidad?: number;
  };
  cantidad: number;
  tipo_venta: 'caja' | 'docena' | 'unidad';
  cambiosPersonalizados?: {
    precioVenta?: number;
    descripcion_personalizada?: string;
  };
};

type Destinatario = {
  numero_documento: string;
  nombre: string;
  apellido: string;
  telefono: string;
};

const generatePDF = async(
  selectedProducts: Cotizacion[],
  totalAmount: number,
  reciboNo: string,
  fecha: string,
  userName: string,
  destinatario: Destinatario,
  tipo: 'cliente'
) => {

  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const pdfFonts = await import('pdfmake/build/vfs_fonts');

  const pdfMake = pdfMakeModule.default;
  (pdfMake as any).vfs = (pdfFonts as any).default.vfs;

  // Function to get the final price based on sale type
  const getPrecioFinal = (producto: Cotizacion) => {
    let price;
    if (producto.cambiosPersonalizados?.precioVenta) {
      price = producto.cambiosPersonalizados.precioVenta;
    } else {
      switch (producto.tipo_venta) {
        case 'caja':
          price = producto.product.precio_caja || producto.product.VENTA_SOLES;
          break;
        case 'docena':
          price = producto.product.precio_docena || producto.product.VENTA_SOLES;
          break;
        default:
          price = producto.product.precio_unidad || producto.product.VENTA_SOLES;
      }
    }
    return Number(price) || 0;
  };

  const tableBody = [
    [
      { text: "Código", style: "tableHeader", alignment: 'center' },
      { text: "Descripción", style: "tableHeader", alignment: 'center' },
      { text: "Tipo", style: "tableHeader", alignment: 'center' },
      { text: "Cantidad", style: "tableHeader", alignment: 'center' },
      { text: "P.Unit", style: "tableHeader", alignment: 'center' },
      { text: "Total", style: "tableHeader", alignment: 'center' },
    ],
    ...selectedProducts.map((item) => {
      const precioFinal = getPrecioFinal(item);
      const subtotal = precioFinal * item.cantidad;
      
      return [
        { text: item.product.codigo || '-', alignment: 'center' },
        { 
          text: item.cambiosPersonalizados?.descripcion_personalizada || 
                item.product.descripcion,
          alignment: 'left'
        },
        { text: item.tipo_venta.toString(), alignment: 'center' },
        { text: item.cantidad.toString(), alignment: 'center' },
        { text: `S/ ${precioFinal.toFixed(2)}`, alignment: 'right' },
        { text: `S/ ${subtotal.toFixed(2)}`, alignment: 'right' },
      ];
    }),
  ];

  const content: any[] = [
        // Header with logo and company info
        {
            columns: [
              { image: variable64.miVar, width: 70 },
              {
                stack: [
                  { text: "Importaciones Sarmiento", style: "companyName" },
                  { text: "VENTA DE FLORES ARTIFICIALES, CORTINAS AL POR MAYOR Y MENOR", style: "companyInfo" },
                  { text: "PEDIDOS A PROVINCIA", style: "companyInfo" },
                  { text: "JR. ANDAHUAYLAS N° 1412 INT 3021", style: "companyInfo" },
                  { text: "CEL: 995 433 229 | 946 424 748", style: "typeBlond" }
                ],
                width: '*',
                margin: [10, 0, 0, 0]
              },
              {
                stack: [
                    { text: "RUC: 10405086137", style: "header" },
                    { text: `COTIZACIÓN N° ${reciboNo}`, style: "header" },
                    { text: `Fecha: ${fecha} ${new Date().toLocaleTimeString('es-PE')}`, style: "companyInfo" }
                ],
                alignment: "right",
                width: 'auto'
              },
            ],
            margin: [0, 0, 0, 2]
          },

    // Client Information Box
    {
        columns: [
              {
                stack: [
                  { 
                    text: "Información del Cliente",
                    style: "clientHeader",
                    margin: [10, 5, 0, 5]
                  },
                  { 
                    text: `DNI/RUC: ${destinatario.numero_documento}`,
                    style: "clientInfo",
                    margin: [10, 2, 0, 2]
                  },
                  { 
                    text: `Nombre: ${destinatario.nombre} ${destinatario.apellido}`,
                    style: "clientInfo",
                    margin: [10, 2, 0, 2]
                  },
                  { 
                    text: `Teléfono: ${destinatario.telefono}`,
                    style: "clientInfo",
                    margin: [10, 2, 0, 2]
                  }
                ],
                width: '*'
              },
              {
                stack: [
                  { 
                    text: "Vendedor",
                    style: "clientHeader",
                    margin: [10, 5, 0, 5]
                  },
                  { 
                    text: `Nombre: ${userName}`,
                    style: "clientInfo",
                    margin: [10, 2, 0, 2]
                  },
                  { 
                    text: "Departamento: Ventas",
                    style: "clientInfo",
                    margin: [10, 2, 0, 2]
                  }
                ],
                width: '*'
              },
              {
                stack: [
                    { text: "¡ESCANEA Y DESCUBRE", style: "qrLabel", alignment: 'center', margin: [0, 20, 0, 0] },
                    { text: "NUESTRO CATÁLOGO COMPLETO!", style: "qrLabel", alignment: 'center' },
                  {
                    qr: 'https://www.importaciones-sarmiento.com',
                    fit: 80,
                    margin: [35, 5, 0, 0]
                  }
                ],
                width: 'auto',
                margin: [0, -40, 0, 0]
            }
        ],
        margin: [0, 0, 0, 10]
    },

    // Products Table
    {
      table: {
        headerRows: 1,
        widths: [60, '*', 60, 60, 70, 70],
        body: tableBody,
      },
      layout: {
        hLineWidth: function(i: number, node: any) {
          return (i === 0 || i === node.table.body.length) ? 2 : 1;
        },
        vLineWidth: function(i: number, node: any) {
          return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        },
        hLineColor: function(i: number, node: any) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
        },
        vLineColor: function(i: number, node: any) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
        },
      }
    },

    // Total Amount
    {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            body: [
              [
                { text: 'TOTAL A PAGAR:', style: 'totalLabel' },
                { text: `S/ ${(Number(totalAmount) || 0).toFixed(2)}`, style: 'totalAmount' }
              ]
            ]
          },
          layout: 'noBorders',
          margin: [0, 10, 0, 20]
        }
      ]
    },

    // Bank Accounts Section
    {
      text: "CUENTAS BANCARIAS: RECARGO DEL 5% POR PAGOS CON TARJETA DE CRÉDITO O DÉBITO",
      style: "bankTitle", alignment: 'center',
      margin: [0, 0, 0, 10]
    },

    // Bank Information Box
    {
        stack: [
            {
                columns: [
                  {
                    stack: [
                      { image: inte.miVar, width: 130, alignment: 'center' },
                      { text: "1173093551275", style: "bankInfo", alignment: 'center' },
                    ],
                    width: '*'
                  },
                  {
                    stack: [
                      { image: bcp.miVar, width: 80, alignment: 'center' },
                      { text: "191-91164508060", style: "bankInfo", alignment: 'center' },
                    ],
                    width: '*'
                  },
                  {
                    stack: [
                      { image: bbva.miVar, width: 80, alignment: 'center' },
                      { text: "0011-03460200162864", style: "bankInfo", alignment: 'center' },
                    ],
                    width: '*'
                  }
                ],
                margin: [0, 0, 0, 0]
            }
        ],
        margin: [0, 0, 0, 20]
    },

    // Footer with QR and Schedule
    {
      columns: [
        {
          stack: [
            { text: "HORARIOS DE ATENCIÓN", style: "scheduleHeader", alignment: 'center' },
            { text: "LUNES A VIERNES: 9:30 AM - 8:00 PM | SÁBADO: 10:00 AM - 7:00 PM", style: "scheduleInfo", alignment: 'center' }
          ],
          width: '*',
          margin: [20, 20, 0, 0]
        }
      ]
    }
  ];

  const styles: StyleDictionary = {
    companyName: {
      fontSize: 16,
      bold: true,
      margin: [0, 0, 0, 5] as [number, number, number, number]
    },
    typeBlond: {
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 5] as [number, number, number, number]
    },
    companyInfo: {
      fontSize: 10,
      margin: [0, 2, 0, 0] as [number, number, number, number]
    },
    header: {
      fontSize: 14,
      bold: true,
      margin: [0, 0, 0, 5] as [number, number, number, number]
    },
    subheader: {
      fontSize: 12,
      margin: [0, 0, 0, 0] as [number, number, number, number]
    },
    tableHeader: {
      fontSize: 11,
      bold: true,
      color: 'black',
      margin: [0, 5, 0, 5] as [number, number, number, number]
    },
    clientHeader: {
      fontSize: 12,
      bold: true
    },
    clientInfo: {
      fontSize: 10
    },
    totalLabel: {
      fontSize: 12,
      bold: true,
      margin: [0, 5, 10, 0] as [number, number, number, number]
    },
    totalAmount: {
      fontSize: 12,
      bold: true,
      margin: [0, 5, 0, 0] as [number, number, number, number]
    },
    paymentNotice: {
      fontSize: 11,
      bold: true
    },
    bankTitle: {
      fontSize: 12,
      bold: true
    },
    bankInfo: {
      fontSize: 10,
      bold: true,
      margin: [0, 5, 0, 0] as [number, number, number, number]
    },
    qrLabel: {
      fontSize: 10,
      bold: true
    },
    scheduleHeader: {
      fontSize: 12,
      bold: true,
      margin: [0, 0, 0, 10] as [number, number, number, number]
    },
    scheduleInfo: {
      fontSize: 10,
      margin: [0, 2, 0, 0] as [number, number, number, number]
    }
  };

  const docDefinition: TDocumentDefinitions = {
    content,
    styles,
    pageSize: 'A4',
    pageMargins: [25, 25, 25, 25] as [number, number, number, number],
  };

  pdfMake.createPdf(docDefinition).open();
};

export default generatePDF;