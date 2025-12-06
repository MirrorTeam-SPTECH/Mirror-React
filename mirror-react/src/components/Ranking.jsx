export default function Ranking({ title, data = [], loading = false }) {
  return (
    <div className="flex h-125 w-50 z-10 bg-white !mt-10 rounded-xl shadow-md p-4 justify-center  overflow-y-auto !py-4">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-center !mb-2">
          <h3 className="text-gray-700 font-semibold text-base">{title}</h3>
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2"
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="space-y-2 text-xs">
              {data.slice(0, 8).map((produto, index) => (
                <div
                  key={index}
                  className="flex items-center !p-2 !gap-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div
                    className="flex items-center justify-center mr-2"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                    }}
                  >
                    <span className="text-base font-bold text-gray-800">
                      {index + 1}°
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className="text-sm text-gray-900 font-semibold truncate"  
                      title={produto.nomeProduto}
                    >
                      {produto.nomeProduto}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {produto.quantidade} Pedidos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}