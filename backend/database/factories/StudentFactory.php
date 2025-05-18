<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class StudentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Student::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $genders = ['Male', 'Female', 'Other'];
        $courses = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'];
        $yearLevels = ['1st', '2nd', '3rd', '4th', '5th'];
        $sections = ['A', 'B', 'C', 'D'];

        return [
            'email' => $this->faker->unique()->safeEmail(),
            'firstName' => $this->faker->firstName(),
            'lastName' => $this->faker->lastName(),
            'middleName' => $this->faker->optional()->firstName(),
            'age' => $this->faker->numberBetween(17, 30),
            'gender' => $this->faker->randomElement($genders),
            'course' => $this->faker->randomElement($courses),
            'yearLevel' => $this->faker->randomElement($yearLevels),
            'section' => $this->faker->randomElement($sections),
        ];
    }
}
