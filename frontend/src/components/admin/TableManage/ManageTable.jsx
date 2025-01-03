import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import AddTable from "./AddTable";
import UpdateTable from "./UpdateTable";

const ManageTable = () => {
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Fetch tables from the server
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tables");
        setTables(response.data.data);
      } catch (error) {
        console.error("Error fetching tables:", error.message);
      }
    };

    fetchTables();
  }, []);

  // Filter tables based on search term
  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle isActive for a table
  const toggleIsActive = async (id) => {
    try {
      const table = tables.find((t) => t._id === id);
      const newIsActive = table.isActive === 1 ? 2 : 1;

      // Gửi yêu cầu cập nhật lên server
      const response = await axios.put(
        `http://localhost:5000/api/tables/${id}`,
        {
          isActive: newIsActive,
        },
      );
      if (response.data.success) {
        // Cập nhật trạng thái trong state
        setTables((prevTables) =>
          prevTables.map((t) =>
            t._id === id ? { ...t, isActive: newIsActive } : t,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling isActive:", error.message);
    }
  };

  // Handle table update
  const handleUpdateTable = (updatedTable) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table._id === updatedTable._id ? updatedTable : table,
      ),
    );
  };

  // Open the update form
  const openUpdateForm = (table) => {
    setSelectedTable(table);
    setUpdateFormVisible(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">Quản lý bàn</div>

        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <div className="group relative">
            <button
              onClick={() => setAddFormVisible(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Thêm bàn
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left">Tên bàn</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                <th className="px-4 py-3 text-center">Hoạt động</th>
                <th className="px-4 py-3 text-center">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table) => (
                <tr key={table._id} className="border-b">
                  <td className="px-4 py-6 font-bold">{table.name}</td>
                  <td className="px-4 py-6 text-center">
                    {new Date(table.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-6 text-center">
                    {new Date(table.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-6 text-center text-2xl">
                    <div className="group relative">
                      <FontAwesomeIcon
                        icon={table.isActive === 1 ? faToggleOn : faToggleOff}
                        className={
                          table.isActive === 1
                            ? "cursor-pointer text-green-500"
                            : "cursor-pointer text-gray-400"
                        }
                        onClick={() => toggleIsActive(table._id)}
                      />
                      <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        Bật hoạt động
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center text-xl">
                    <div className="group relative">
                      <button
                        onClick={() => openUpdateForm(table)}
                        className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        Chỉnh sửa
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isAddFormVisible && (
        <AddTable
          onAddTable={(newTable) => {
            setTables([...tables, newTable]);
            setAddFormVisible(false);
          }}
          onClose={() => setAddFormVisible(false)}
        />
      )}

      {isUpdateFormVisible && selectedTable && (
        <UpdateTable
          table={selectedTable}
          onClose={() => setUpdateFormVisible(false)}
          onUpdateTable={(updatedTable) => {
            setTables((prevTables) =>
              prevTables.map((table) =>
                table._id === updatedTable._id ? updatedTable : table,
              ),
            );
          }}
        />
      )}
    </div>
  );
};

export default ManageTable;
