"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentApi } from "@/hooks/useStudent";
import { ArrowLeft, Save, Loader2, User, X, Edit } from "lucide-react";
import Link from "next/link";

// This component handles both view and edit modes for students
export default function StudentPage({ params }) {
  const router = useRouter();
  const { studentId } = use(params);
  // "new" is a special case for creating new students
  const isNewStudent = studentId === "new";

  // View mode can be controlled via URL or state
  const [isViewMode, setIsViewMode] = useState(false);
  const { getStudent, createStudent, updateStudent, loading } = useStudentApi();

  const [formTitle, setFormTitle] = useState("Add New Student");
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Add local loading state to manage the spinner properly
  const [isSaving, setIsSaving] = useState(false);
  // Track if we've loaded student data already
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize form with empty values that match the API structure
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    course: "",
    yearLevel: "",
    section: "",
  });

  useEffect(() => {
    // Only run this effect once when component mounts
    if (dataLoaded) return;

    // Determine if we're in view mode from URL - check for both view and edit params
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get("view") === "true";
    const editParam = urlParams.get("edit") === "true";

    // If edit=true is specified, we force edit mode regardless of view parameter
    // Otherwise, use the view parameter as before
    setIsViewMode(editParam ? false : viewParam);

    // Set form title based on mode
    if (!isNewStudent) {
      setFormTitle(
        (editParam ? false : viewParam) ? "Student Details" : "Edit Student"
      );

      // Fetch student data if not creating a new student
      getStudent(studentId)
        .then((data) => {
          if (data) {
            // Ensure all form fields have at least empty strings rather than null or undefined
            const sanitizedData = {
              firstName: data.firstName || "",
              middleName: data.middleName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              age: data.age?.toString() || "",
              gender: data.gender || "",
              course: data.course || "",
              yearLevel: data.yearLevel || "",
              section: data.section || "",
            };
            setFormData(sanitizedData);
            setDataLoaded(true);
          }
        })
        .catch((err) => console.error("Error fetching student:", err));
    } else {
      setFormTitle("Add New Student");
      setDataLoaded(true);
    }
  }, [studentId, isNewStudent, getStudent, dataLoaded]);

  // Function to toggle between view and edit modes
  const toggleEditMode = () => {
    setIsViewMode(!isViewMode);

    // Update URL without causing a page reload
    const url = new URL(window.location);
    if (isViewMode) {
      // When switching to edit mode, set edit=true and remove view=true
      url.searchParams.set("edit", "true");
      url.searchParams.delete("view");
    } else {
      // When switching to view mode, set view=true and remove edit=true
      url.searchParams.set("view", "true");
      url.searchParams.delete("edit");
    }
    window.history.pushState({}, "", url);

    // Update the form title based on new mode
    setFormTitle(!isViewMode ? "Student Details" : "Edit Student");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the form data with the new value
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.age) newErrors.age = "Age is required";
    else if (
      isNaN(parseInt(formData.age, 10)) ||
      parseInt(formData.age, 10) < 1
    )
      newErrors.age = "Age must be a valid number";

    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.course.trim()) newErrors.course = "Course is required";
    if (!formData.yearLevel.trim())
      newErrors.yearLevel = "Year level is required";
    if (!formData.section.trim()) newErrors.section = "Section is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Set local saving state to true
      setIsSaving(true);

      // Convert age to number before sending to API
      const submissionData = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : 0,
      };

      if (!isNewStudent) {
        await updateStudent(studentId, submissionData);
      } else {
        await createStudent(submissionData);
      }

      // Success path - set success state and reset saving state
      setSaveSuccess(true);
      setIsSaving(false);

      setTimeout(() => {
        router.push("/students");
      }, 1500);
    } catch (error) {
      console.error("Error saving student:", error);
      // Error path - reset saving state and show error
      setIsSaving(false);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save. Please try again.",
      }));
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-6 gap-2">
        <Link
          href="/students"
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {formTitle}
        </h1>

        {/* Added Edit/View toggle button */}
        {!isNewStudent && (
          <button
            onClick={toggleEditMode}
            className="ml-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors shadow-sm font-medium"
          >
            {isViewMode ? (
              <>
                <Edit size={16} />
                <span>Edit</span>
              </>
            ) : (
              <>
                <User size={16} />
                <span>View</span>
              </>
            )}
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-green-500 rounded-full bg-green-100 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p>Student saved successfully! Redirecting...</p>
          </div>
          <button
            className="text-green-700"
            onClick={() => setSaveSuccess(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-red-500 rounded-full bg-red-100 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p>{errors.submit}</p>
          </div>
          <button
            className="text-red-700"
            onClick={() => setErrors((prev) => ({ ...prev, submit: null }))}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Student profile header section */}
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 rounded-full p-3">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {!isNewStudent
                  ? `${formData.firstName} ${formData.lastName}`
                  : "New Student"}
              </h2>
              {!isNewStudent && (
                <p className="text-gray-500 text-sm">{formData.email}</p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <fieldset className="col-span-1 md:col-span-2 border border-gray-200 rounded-lg p-4">
              <legend className="text-lg font-medium text-gray-700 px-2">
                Personal Information
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Middle Name */}
                <div>
                  <label
                    htmlFor="middleName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.middleName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    min="1"
                    className={`w-full px-3 py-2 border ${
                      errors.age ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Academic Information Section */}
            <fieldset className="col-span-1 md:col-span-2 border border-gray-200 rounded-lg p-4">
              <legend className="text-lg font-medium text-gray-700 px-2">
                Academic Information
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Course */}
                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Course <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.course ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  />
                  {errors.course && (
                    <p className="mt-1 text-sm text-red-500">{errors.course}</p>
                  )}
                </div>

                {/* Year Level */}
                <div>
                  <label
                    htmlFor="yearLevel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="yearLevel"
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.yearLevel ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  >
                    <option value="">Select year level</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="5th">5th Year</option>
                  </select>
                  {errors.yearLevel && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.yearLevel}
                    </p>
                  )}
                </div>

                {/* Section */}
                <div>
                  <label
                    htmlFor="section"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border ${
                      errors.section ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isViewMode ? "bg-gray-50" : ""
                    }`}
                  />
                  {errors.section && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.section}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/students"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isViewMode ? "Back" : "Cancel"}
            </Link>

            {!isViewMode && (
              <button
                type="submit"
                disabled={isSaving || saveSuccess}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                  isSaving || saveSuccess ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Student
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
