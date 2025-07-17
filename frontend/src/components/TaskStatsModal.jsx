import { useEffect, useRef } from "react";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

const getLastSixMonthsData = (tasks) => {
    const now = new Date();
    const monthsData = {};

    for(let i = 5; i >= 0; i--){
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = date.toLocaleDateString('es-ES', {month:"short"});
        monthsData[key] = 0;
    }

    tasks.forEach(({createdAt}) => {
        const taskDate = new Date(createdAt);
        const key = taskDate.toLocaleDateString('es-ES', {month:"short"})
        if(monthsData[key] !== undefined) monthsData[key]++;
    });

    return monthsData;

}

const getFileStats = (tasks) => {
    const fileTypes = {};
    let conArchivos = 0, totalArchivos = 0;

    tasks.forEach(task => {
        const files = task.files || []
        if(files.length) conArchivos++;
        totalArchivos += files.length;
        
    files.forEach(file => {
    let type = file.mimetype?.split("/")[0];
    if (!type && file.name) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) type = "image";
        else if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) type = "application";
        else if (["txt", "md", "csv"].includes(ext)) type = "text";
        else if (["mp4", "avi", "mov", "wmv"].includes(ext)) type = "video";
    }
    const map = {image: 'Imágenes', application: "Documentos", text: "Texto", video: "Videos"};
    const display = map[type] || "otros";
    fileTypes[display] = (fileTypes[display] || 0) + 1 ;
    });
    });

    const topFileType = Object.entries(fileTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return {conArchivos, totalArchivos, topFileType}

}

const StatCard = ({value, label, color}) => (
     <div className={`bg-${color}-50 p-4 rounded-lg text-center`}>
    <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
    <div className={`text-sm text-${color}-800`}>{label}</div>
  </div>
)


function TaskStatsModal({tasks = [], onClose}) {

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() =>{
        if(!tasks.length) return
        const monthsData = getLastSixMonthsData(tasks)
        const ctx = chartRef.current.getContext("2d");

        chartInstance.current?.destroy();

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(monthsData),
                datasets: [{
                    label: 'Tareas',
                    data: Object.values(monthsData),
                    backgroundColor: '#3B82F6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {display: false}},
                scales:{y: {beginAtZero: true, ticks:{stepSize: 1}}}
            }
        })
        return () => chartInstance.current?.destroy();

    }, [tasks])

    if(!tasks.length){
      return(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Estadísticas</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <p className="text-gray-600 text-center">No hay tareas para mostrar</p>
        </div>
      </div>
      )
    }

    const now = new Date();
    const thisMonth = tasks.filter(({createdAt}) => {
        const d = new Date(createdAt);
        return d.getMonth() === now.getMonth && d.getFullYear() === now.getFullYear() 
    }).length;

    const {conArchivos, totalArchivos, topFileType} = getFileStats(tasks)


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Estadísticas de Tareas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value={tasks.length} label="Total" color="blue" />
          <StatCard value={thisMonth} label="Este Mes" color="green" />
          <StatCard value={conArchivos} label="Con Archivos" color="purple" />
          <StatCard value={totalArchivos} label="Total Archivos" color="orange" />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Últimos 6 Meses</h3>
          <div className="h-48"><canvas ref={chartRef}></canvas></div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
          <strong>Tipo de archivo más común:</strong> {topFileType}
        </div>
      </div>
    </div>
  )
}

export default TaskStatsModal
