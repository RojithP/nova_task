import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axiosHttp from "../../helper/axios";
import { toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate()
    const handleSubmit = async (values) => {
        try {
            let login = await axiosHttp.post("/login", values)
            if (login.data.data) {
                toast(login.data.message);
                localStorage.setItem("token", login.data?.data.token)
                setTimeout(() => {
                    navigate("/", { replace: true })
                }, 0)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };
    const loginFormik = useFormik({
        initialValues: {
            email_id: "",
            password: "",
        },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        validate: ({ email_id, password }) => {
            const error = {};
            if (!email_id) error.email_id = "Required Email";
            if (!password) error.password = "Required Password";
            return error;
        },
        onSubmit: handleSubmit,
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            {...loginFormik.getFieldProps("email_id")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        {loginFormik.errors.email_id && <span className="text-red-500 text-sm">{loginFormik.errors.email_id}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            {...loginFormik.getFieldProps("password")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        {loginFormik.errors.password && <span className="text-red-500 text-sm">{loginFormik.errors.password}</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                    <div className="text-center">
                        <Link to={"/register"} className="text-blue-600 ">Do you want to signup?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
