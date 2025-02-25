import { useFormik } from "formik";
import { useAuth } from "../../components/ProtectedRoute";
import axiosHttp from "../../helper/axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
    const { auth, logout } = useAuth();
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.currentTarget.files[0]);
    };

    const formik = useFormik({
        initialValues: {
            chat_history: null,
        },
        onSubmit: async (_) => {
            const formData = new FormData();
            formData.append("chat_history", file);
            try {
                const response = await axiosHttp.post("/chathistory", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status == 200) {
                    toast(response.data?.message);
                    setFile(null)
                }
            } catch (error) {
                console.error("File upload error:", error);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold">Nova</h1>
                <div className="flex items-center space-x-4">
                    <span className="font-medium">{auth?.first_name} {auth?.last_name}</span>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form
                    onSubmit={formik.handleSubmit}
                    className="bg-white shadow-lg rounded-lg p-6 w-96 text-center"
                >
                    <h2 className="text-lg font-semibold mb-4">Upload Chat History</h2>

                    <input
                        type="file"
                        name="chat_history"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 cursor-pointer focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
}
