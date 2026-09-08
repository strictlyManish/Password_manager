import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser , clearError } from "../app/features/authSlice";

function Register() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));

    // Handle register failure
    if (registerUser.rejected.match(result)) {
      setError("root", {
        message:
          result.payload || "register failed. Please check your credentials.",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-lg p-10 text-center max-w-sm w-full"
          >
            <div className="text-4xl mb-4"></div>
            <h2 className="text-xl font-serif text-white mb-2 tracking-tight">
              Vault created
            </h2>
            <p className="text-[#8a8a8a] text-sm leading-relaxed font-mono">
              Check your inbox. We sent you a key.
            </p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-30 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[#111111]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-lg p-8 md:p-10 max-w-md w-full"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-serif text-lg text-white tracking-tight">
                Credentials
              </span>
              <span className="text-[#c8ff00] font-mono text-[10px] border border-[#c8ff00] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                R
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight mb-2">
              Create your <span className="italic text-[#c8ff00]">vault</span>
            </h1>
            <p className="text-[#8a8a8a] text-sm font-mono">
              Takes about a minute. No credit card.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div>
              <label className="block text-xs font-mono text-[#8a8a8a] mb-1.5 tracking-wider uppercase">
                Full name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                {...register("fullname", {
                  required: "We'll need your name",
                  minLength: { value: 2, message: "A bit longer please" },
                })}
                className={`w-full px-4 py-2.5 bg-[#0a0a0a] border text-sm text-white placeholder-[#555] outline-none transition-all duration-200 focus:ring-1 font-mono ${
                  errors.name
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-[#2a2a2a] focus:border-[#c8ff00] focus:ring-[#c8ff00]/20"
                }`}
              />
              <AnimatePresence>
                {errors.fullname && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="text-red-400 text-xs mt-1.5 font-mono"
                  >
                    {errors.fullname.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8a8a8a] mb-1.5 tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                placeholder="jane@company.com"
                {...register("email", {
                  required: "Need an email to reach you",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "That doesn't look right",
                  },
                })}
                className={`w-full px-4 py-2.5 bg-[#0a0a0a] border text-sm text-white placeholder-[#555] outline-none transition-all duration-200 focus:ring-1 font-mono ${
                  errors.email
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-[#2a2a2a] focus:border-[#c8ff00] focus:ring-[#c8ff00]/20"
                }`}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="text-red-400 text-xs mt-1.5 font-mono"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <label className="block text-xs font-mono text-[#8a8a8a] mb-1.5 tracking-wider uppercase">
                  Master password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  {...register("password", {
                    required: "Gotta have a password",
                    minLength: {
                      value: 8,
                      message: "Make it at least 8 chars",
                    },
                  })}
                  className={`w-full px-4 py-2.5 bg-[#0a0a0a] border text-sm text-white placeholder-[#555] outline-none transition-all duration-200 focus:ring-1 font-mono ${
                    errors.password
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-[#2a2a2a] focus:border-[#c8ff00] focus:ring-[#c8ff00]/20"
                  }`}
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="text-red-400 text-xs mt-1.5 font-mono"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-mono text-[#8a8a8a] mb-1.5 tracking-wider uppercase">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Type it again"
                  {...register("confirmPassword", {
                    required: "Please confirm",
                    validate: (val) =>
                      val === password || "Passwords don't match",
                  })}
                  className={`w-full px-4 py-2.5 bg-[#0a0a0a] border text-sm text-white placeholder-[#555] outline-none transition-all duration-200 focus:ring-1 font-mono ${
                    errors.confirmPassword
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-[#2a2a2a] focus:border-[#c8ff00] focus:ring-[#c8ff00]/20"
                  }`}
                />
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="text-red-400 text-xs mt-1.5 font-mono"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "You need to agree",
                })}
                className="mt-0.5 h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#c8ff00] focus:ring-[#c8ff00]/30 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs text-[#8a8a8a] leading-relaxed cursor-pointer font-mono"
              >
                I agree to the{" "}
                <span className="text-[#c8ff00] hover:underline">Terms</span>{" "}
                and{" "}
                <span className="text-[#c8ff00] hover:underline">
                  Privacy Policy
                </span>
              </label>
            </div>
            <AnimatePresence>
              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="text-red-400 text-xs font-mono"
                >
                  {errors.terms.message}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-[#c8ff00] hover:bg-[#d4ff33] text-[#0a0a0a] text-xs font-mono tracking-[0.15em] uppercase font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating vault...
                </>
              ) : (
                <>
                  Create vault
                  <span>→</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-[#8a8a8a] mt-8 font-mono">
            Already have a vault?{" "}
            <a href="/login" className="text-[#c8ff00] hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
