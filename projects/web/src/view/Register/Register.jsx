import { useFormik } from "formik";
import axiosHttp from "../../helper/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
    const navigate = useNavigate();

    const registerFormik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email_id: "",
            new_password: "",
            confirm_password: ""
        },
        validate: ({ confirm_password, email_id, first_name, last_name, new_password }) => {
            const error = {};
            if (!first_name) error.first_name = "Required First Name";
            if (!last_name) error.last_name = "Required Last Name";
            if (!email_id) error.email_id = "Required Email";
            if (new_password !== confirm_password) {
                error.new_password = "Passwords do not match";
                error.confirm_password = "Passwords do not match";
            }
            if (!new_password) error.new_password = "Required Password";
            if (!confirm_password) error.confirm_password = "Required Confirm Password";
            return error;
        },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: handleSubmit,
    });

    async function handleSubmit(payload) {
        try {
            let createUser = await axiosHttp.post("/signup", payload);
            if (createUser.status === 201) {
                toast(createUser.data.message);
                registerFormik.resetForm();
                navigate("/login");
            } else {
                toast.error(createUser.data.message)
            }
        } catch (error) {
            toast.error(error?.response.data.message)
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
                <form onSubmit={registerFormik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">First Name</label>
                        <input
                            type="text"
                            {...registerFormik.getFieldProps("first_name")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        {registerFormik.errors.first_name && <span className="text-red-500 text-sm">{registerFormik.errors.first_name}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            {...registerFormik.getFieldProps("last_name")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        {registerFormik.errors.last_name && <span className="text-red-500 text-sm">{registerFormik.errors.last_name}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            {...registerFormik.getFieldProps("email_id")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        {registerFormik.errors.email_id && <span className="text-red-500 text-sm">{registerFormik.errors.email_id}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            {...registerFormik.getFieldProps("new_password")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        {registerFormik.errors.new_password && <span className="text-red-500 text-sm">{registerFormik.errors.new_password}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            {...registerFormik.getFieldProps("confirm_password")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        {registerFormik.errors.confirm_password && <span className="text-red-500 text-sm">{registerFormik.errors.confirm_password}</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Register
                    </button>
                    <div className="text-center">
                        <Link to={"/login"} className="text-blue-600 ">Do you want to login?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
