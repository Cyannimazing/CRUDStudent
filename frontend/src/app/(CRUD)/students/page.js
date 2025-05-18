"use client";
import React, { useEffect, useState } from "react";
import { useStudentApi } from "@/hooks/useStudent";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  const { loading, error, fetchStudents, deleteStudent } = useStudentApi();
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const studentsPerPage = 8;

  useEffect(() => {
    fetchStudents()
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  // Calculate pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id)
        .then(() => {
          setStudents((prev) =>
            prev.filter((s) => s.id !== studentToDelete.id)
          );
          setShowDeleteModal(false);
          setStudentToDelete(null);
        })
        .catch((e) => console.error(e));
    }
  };

  // Generate empty rows to maintain consistent table height
  const emptyRows = studentsPerPage - currentStudents.length;
  const emptyRowElements = emptyRows > 0 && (
    <>
      {Array.from({ length: emptyRows }).map((_, index) => (
        <tr key={`empty-${index}`} className="h-16 border-b border-gray-200">
          <td colSpan="8" className="px-6 py-4">
            &nbsp;
          </td>
        </tr>
      ))}
    </>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading students...</div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 p-4 rounded-md text-red-700">
        Error loading students.
      </div>
    );

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Student List
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <button
            onClick={() => (window.location.href = "/students/new")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Plus size={18} />
            Student
          </button>
        </div>
      </div>

      {/* Table container with fixed width */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <div className="min-h-[432px]">
          {" "}
          {/* Fixed height container based on 8 rows of 54px height */}
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 md:w-16 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="w-40 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="w-52 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="w-16 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Age
                </th>
                <th className="w-20 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Gender
                </th>
                <th className="w-40 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Course
                </th>
                <th className="w-32 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Year & Section
                </th>
                <th className="w-24 px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500 h-16"
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                <>
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 h-16">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                        {student.id}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {student.firstName}{" "}
                          {student.middleName ? student.middleName + " " : ""}
                          {student.lastName}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell truncate">
                        {student.email}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {student.age}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {student.gender}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell truncate">
                        {student.course}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell truncate">
                        {student.yearLevel} - {student.section}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-1 md:gap-2">
                          <Link
                            href={`/students/${student.id}?view=true`}
                            className="p-1 text-blue-600 hover:text-blue-800 rounded"
                            title="View Student"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/students/${student.id}?edit=true`}
                            className="p-1 text-green-600 hover:text-green-800 rounded"
                            title="Edit Student"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            className="p-1 text-red-600 hover:text-red-800 rounded"
                            title="Delete Student"
                            onClick={() => confirmDelete(student)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {emptyRowElements}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
        <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
          Showing{" "}
          <span className="font-medium">
            {filteredStudents.length > 0 ? indexOfFirstStudent + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(indexOfLastStudent, filteredStudents.length)}
          </span>{" "}
          of <span className="font-medium">{filteredStudents.length}</span>{" "}
          results
        </div>

        <div className="flex gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-1 sm:p-2 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dynamic pagination based on screen size */}
          <div className="hidden sm:flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {totalPages > 5 && <span className="px-2 py-1">...</span>}
          </div>

          {/* Mobile pagination indicator */}
          <div className="flex sm:hidden items-center">
            <span className="px-3 py-1 text-sm">
              {currentPage} / {Math.max(1, totalPages)}
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-1 sm:p-2 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {studentToDelete?.firstName}{" "}
              {studentToDelete?.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
