<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'ADMIN', 'description' => 'Quản trị viên hệ thống']);
        $artistRole = Role::firstOrCreate(['name' => 'ARTIST', 'description' => 'Nghệ sĩ phát hành nhạc']);
        $userRole = Role::firstOrCreate(['name' => 'USER', 'description' => 'Người nghe nhạc']);

        // 2. Tạo tài khoản Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt(env('DEFAULT_ADMIN_PASSWORD', 'password')),
                'status' => 'ACTIVE',
            ]
        );
        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        // 3. Tạo tài khoản Artist
        $artist = User::firstOrCreate(
            ['email' => 'artist@gmail.com'],
            [
                'name' => 'Vũ (Artist)',
                'password' => bcrypt(env('DEFAULT_ARTIST_PASSWORD', 'password')),
                'status' => 'ACTIVE',
            ]
        );
        $artist->roles()->syncWithoutDetaching([$artistRole->id]);

        // 4. Tạo tài khoản User
        $user = User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'Melora User',
                'password' => bcrypt(env('DEFAULT_USER_PASSWORD', 'password')),
                'status' => 'ACTIVE',
            ]
        );
        $user->roles()->syncWithoutDetaching([$userRole->id]);
        
        $this->call([
            MusicSeeder::class,
        ]);
    }
}
