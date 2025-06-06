<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Student extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'email',
        'firstName',
        'lastName',
        'middleName',
        'age',
        'gender',
        'course',
        'yearLevel',
        'section',
    ];
}
