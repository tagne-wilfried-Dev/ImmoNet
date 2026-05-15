import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("client")

  return (
    <div className="min-h-70vh bg-[#f8f8f8] flex flex-col">
      {/* HEADER */}
      <header className="w-full px-10 py-8 flex items-center justify-between">
        <h1 className="text-5xl font-bold">ImmoNet</h1>

        <p className="text-lg">
          Already have an account?{" "}
          <span className="font-semibold underline cursor-pointer">
            Login
          </span>
        </p>
      </header>

      {/* MAIN */}
      <main className="flex-1 px-6 pb-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-16 h-full">
          {/* LEFT SIDE */}
          <div className="relative rounded-3xl overflow-hidden min-h-200">
            <img
              src="src/assets/photo-1600585154340-be6161a56a0c.avif"
              alt="House"
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-12 text-white max-w-2xl">
                <h2 className="text-6xl font-bold leading-tight mb-6">
                  Find your next legacy property.
                </h2>

                <p className="text-2xl leading-relaxed text-gray-200">
                  Join the most trusted platform for professional real estate
                  transactions and luxury property management.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center">
            <div className="w-full max-w-xl">
              {/* TITLE */}
              <div className="mb-10">
                <h2 className="text-5xl font-bold mb-3">
                  Create Account
                </h2>

                <p className="text-gray-600 text-lg">
                  Enter your details to get started with NdaConnect.
                </p>
              </div>

              {/* GOOGLE BUTTON */}
              <button className="w-full h-14 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                <img
                  src="src/assets/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />

                <span className="font-medium">
                  Continue with Google
                </span>
              </button>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-sm text-gray-500 uppercase">
                  or
                </span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              {/* FORM */}
              <form className="space-y-5">
                {/* ROLE */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">
                    I am a...
                  </label>

                  <div className="bg-gray-100 p-1 rounded-xl grid grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      className={`h-12 rounded-lg font-medium transition ${
                        role === "client"
                          ? "bg-white shadow text-black"
                          : "text-gray-500"
                      }`}
                    >
                      Client
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("owner")}
                      className={`h-12 rounded-lg font-medium transition ${
                        role === "owner"
                          ? "bg-white shadow text-black"
                          : "text-gray-500"
                      }`}
                    >
                      Propriétaire
                    </button>
                  </div>
                </div>

                {/* FULL NAME */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full h-14 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full h-14 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-14 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="w-full h-14 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button className="w-full h-14 bg-black text-white rounded-xl font-semibold text-lg hover:opacity-90 transition">
                  Create My Account
                </button>

                {/* TERMS */}
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  By clicking "Create My Account", you agree to our{" "}
                  <span className="underline cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-300 py-10 px-10">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-2">
              NdaConnect
            </h3>

            <p className="text-gray-600">
              Professional Real Estate Solutions.
            </p>
          </div>

          <div className="flex gap-8 text-gray-600">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
          </div>

          <p className="text-gray-500">
            © 2024 NdaConnect.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Login