import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import "../styles/Resultados.css"

import { registerAllModules } from 'handsontable/registry';

import { HotTable } from '@handsontable/react-wrapper';

registerAllModules();

// ...existing code...
export default function Resultados() {
    return (
      <div className="flex h-64 w-292 bg-white rounded-xl z-10 !ml-18 !mt-5 shadow-md">
        <div className="w-full flex-1 flex flex-col">
          <HotTable
            data={[
              ['2019', 10, 11, 12, 13, 1, 1, 1],
              ['2020', 20, 11, 14, 13],
              ['2021', 30, 15, 12, 13]
            ]}
            rowHeaders={true}
             colHeaders={[
              'N° Pedido', 'Cliente', 'Categoria', 'Item', 'Data/Hora', 'Pagamento', 'Tipo', 'Valor'
            ]}
            height="auto"
            width={'100%'}
            autoWrapRow={true}
            autoWrapCol={true}
            licenseKey="non-commercial-and-evaluation"
          />
        </div>
      </div>
    );
}
// ...existing code...