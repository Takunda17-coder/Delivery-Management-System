import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import useCRUD from "../../hooks/useCRUD";
import api from "../../api/axiosConfig";
import { Modal, FormInput, FormSelect, Badge } from "../../components/ui/index.jsx";
import { toast } from "react-hot-toast";

const ManageDevices = () => {
    const defaultForm = {
        name: "",
        serial_number: "",
        driver_id: "",
        status: "Active",
    };

    const {
        data: devices,
        form,
        setForm,
        handleSubmit,
        handleEdit,
        handleDelete,
        isEditing,
        loading,
        submitting,
        modalOpen,
        setModalOpen,
    } = useCRUD("devices", defaultForm, "device_id");

    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        // Fetch drivers for dropdown
        const fetchDrivers = async () => {
            try {
                const res = await api.get("/drivers");
                setDrivers(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load drivers", err);
                toast.error("Failed to load drivers");
            }
        };
        fetchDrivers();
    }, []);

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl text-gray-900 font-bold">Manage GPS Devices</h1>
                    <button
                        onClick={() => {
                            setForm(defaultForm);
                            setModalOpen(true);
                        }}
                        className="bg-deep-orange text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-700 transition font-medium"
                    >
                        + Add Device
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="py-4 px-6 text-left">ID</th>
                                <th className="py-4 px-6 text-left">Device Name</th>
                                <th className="py-4 px-6 text-left">Serial Number</th>
                                <th className="py-4 px-6 text-left">Assigned Driver</th>
                                <th className="py-4 px-6 text-left">Last Location</th>
                                <th className="py-4 px-6 text-left">Status</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4">
                            {devices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                                        No devices found.
                                    </td>
                                </tr>
                            ) : (
                                devices.map((d) => (
                                    <tr
                                        key={d.device_id}
                                        className="bg-white hover:bg-orange-50 transition-colors duration-200 shadow-sm rounded-lg"
                                    >
                                        <td className="py-4 px-6 font-medium text-gray-900 border-y first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg border-gray-100">
                                            #{d.device_id}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">{d.name}</td>
                                        <td className="py-4 px-6 text-gray-600 font-mono text-sm border-y border-gray-100">
                                            {d.serial_number}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 border-y border-gray-100">
                                            {d.driver
                                                ? `${d.driver.first_name} ${d.driver.last_name}`
                                                : <span className="text-gray-400 italic">Unassigned</span>}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 text-xs border-y border-gray-100">
                                            {d.last_lat && d.last_lng
                                                ? `${Number(d.last_lat).toFixed(4)}, ${Number(d.last_lng).toFixed(4)}`
                                                : "-"}
                                        </td>
                                        <td className="py-4 px-6 border-y border-gray-100">
                                            <Badge status={d.status} />
                                        </td>
                                        <td className="py-4 px-6 text-center border-y last:border-r last:rounded-r-lg border-gray-100">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(d)}
                                                    className="text-gray-500 hover:text-deep-orange transition font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(d.device_id)}
                                                    className="text-gray-400 hover:text-red-500 transition font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <Modal
                    isOpen={modalOpen}
                    title={isEditing ? "Edit Device" : "Add New Device"}
                    onClose={() => setModalOpen(false)}
                    footer={
                        <div className="flex gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-deep-orange text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition font-medium"
                            >
                                {submitting ? "Saving..." : "Save Device"}
                            </button>
                        </div>
                    }
                >
                    <div className="space-y-4">
                        <FormInput
                            label="Device Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Serial Number"
                            value={form.serial_number}
                            onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                            required
                        />
                        <FormSelect
                            label="Assigned Driver"
                            value={form.driver_id}
                            onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
                            options={drivers.map((drv) => ({
                                value: drv.driver_id,
                                label: `${drv.first_name} ${drv.last_name} (${drv.license_number})`,
                            }))}
                        />
                        <FormSelect
                            label="Status"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            options={[
                                { value: "Active", label: "Active" },
                                { value: "Inactive", label: "Inactive" },
                            ]}
                            required
                        />
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default ManageDevices;
