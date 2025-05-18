import { useState } from "react";
import axios from "../lib/axios"; // Adjust path based on your folder structure

export function useStudentApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all students
   * @returns {Promise<Array>} List of students
   */
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/students");
      return res.data;
    } catch (err) {
      setError("Failed to fetch students");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a specific student by ID
   * @param {number|string} id Student ID
   * @returns {Promise<Object>} Student data
   */
  const getStudent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/students/${id}`);
      return res.data;
    } catch (err) {
      setError("Failed to fetch student");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new student
   * @param {Object} data Student data
   * @returns {Promise<Object>} Created student data
   */
  const createStudent = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/students", data);
      return res.data;
    } catch (err) {
      setError("Failed to create student");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing student
   * @param {number|string} id Student ID
   * @param {Object} data Updated student data
   * @returns {Promise<Object>} Updated student data
   */
  const updateStudent = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/students/${id}`, data);
      return res.data;
    } catch (err) {
      setError("Failed to update student");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a student
   * @param {number|string} id Student ID
   * @returns {Promise<void>}
   */
  const deleteStudent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/students/${id}`);
    } catch (err) {
      setError("Failed to delete student");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}
