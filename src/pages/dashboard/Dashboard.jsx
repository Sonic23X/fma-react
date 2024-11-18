import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { useTable } from "@tanstack/react-table";

const Dashboard = () => {
  const [empresaId, setEmpresaId] = useState("");
  const [totalActivos, setTotalActivos] = useState(0);
  const [barrasTipoActivos, setBarrasTipoActivos] = useState({});
  const [barrasEstadoActivos, setBarrasEstadoActivos] = useState({});
  const [tablaActivos, setTablaActivos] = useState([]);
  const [pastelTipoActivos, setPastelTipoActivos] = useState({});
  const [pastelEstadoActivos, setPastelEstadoActivos] = useState([]);

  useEffect(() => {
    if (empresaId) {
      // Llamadas al backend con el filtro por empresa
      axios
        .get(`/api/activos/totales?empresaId=${empresaId}`)
        .then((response) => {
          setTotalActivos(response.data.total);
        });

      axios.get(`/api/activos/tipo?empresaId=${empresaId}`).then((response) => {
        setBarrasTipoActivos({
          labels: response.data.labels,
          datasets: [
            {
              label: "Activos por Tipo",
              data: response.data.data,
              backgroundColor: "#42A5F5",
            },
          ],
        });

        setPastelTipoActivos({
          labels: response.data.labels,
          datasets: [
            {
              label: "Porcentaje por Tipo",
              data: response.data.data,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        });
      });

      axios
        .get(`/api/activos/estado?empresaId=${empresaId}`)
        .then((response) => {
          setBarrasEstadoActivos({
            labels: ["Completos", "Pendientes"],
            datasets: [
              {
                label: "Estado de Activos",
                data: [response.data.completos, response.data.pendientes],
                backgroundColor: "#66BB6A",
              },
            ],
          });

          setPastelEstadoActivos({
            labels: ["Completos", "Pendientes"],
            datasets: [
              {
                label: "Estado de Activos",
                data: [response.data.completos, response.data.pendientes],
                backgroundColor: ["#FF6384", "#36A2EB"],
              },
            ],
          });
        });

      axios
        .get(`/api/activos/tabla?empresaId=${empresaId}`)
        .then((response) => {
          setTablaActivos(response.data);
        });
    }
  }, [empresaId]);

  // Configuración de la tabla
  const columns = [
    {
      Header: "Nombre del Activo",
      accessor: "nombre",
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
    },
  ];

  const tableInstance = useTable({ data: tablaActivos, columns });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Dashboard de Activos
      </h1>

      <div className="mb-4">
        {/* Selector de empresa */}
        <select
          value={empresaId}
          onChange={(e) => setEmpresaId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Selecciona una empresa</option>
          <option value="1">Empresa 1</option>
          <option value="2">Empresa 2</option>
          <option value="3">Empresa 3</option>
          {/* Agrega más opciones según sea necesario */}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total de activos */}
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-600">
            Total de Activos
          </h2>
          <p className="text-4xl font-bold text-blue-500">{totalActivos}</p>
        </div>

        {/* Gráfica de barras por tipo */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Activos por Tipo
          </h2>
          <Bar data={barrasTipoActivos} />
        </div>

        {/* Gráfica de barras por estado */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Activos por Estado
          </h2>
          <Bar data={barrasEstadoActivos} />
        </div>

        {/* Tabla de activos */}
        <div className="bg-white shadow-md rounded-lg p-4 col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Activos Detallados
          </h2>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-left text-gray-600"
                  >
                    {col.Header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tablaActivos.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {row.nombre}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.cantidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráfica de pastel por tipo */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Porcentaje de Activos por Tipo
          </h2>
          <Pie data={pastelTipoActivos} />
        </div>

        {/* Gráfica de pastel por estado */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Porcentaje de Activos por Estado
          </h2>
          <Pie data={pastelEstadoActivos} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
