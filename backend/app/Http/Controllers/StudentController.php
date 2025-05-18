<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:students,email',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'middleName' => 'nullable|string',
            'age' => 'required|integer',
            'gender' => 'required|string',
            'course' => 'required|string',
            'yearLevel' => 'required|string',
            'section' => 'required|string',
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        return response()->json($student);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'email' => 'sometimes|required|email|unique:students,email,' . $student->id,
            'firstName' => 'sometimes|required|string',
            'lastName' => 'sometimes|required|string',
            'middleName' => 'nullable|string',
            'age' => 'sometimes|required|integer',
            'gender' => 'sometimes|required|string',
            'course' => 'sometimes|required|string',
            'yearLevel' => 'sometimes|required|string',
            'section' => 'sometimes|required|string',
        ]);

        $student->update($validated);

        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json(null, 204);
    }
}
