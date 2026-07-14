<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kegiatan');
            $table->text('deskripsi')->nullable();
            $table->date('tgl_dari');
            $table->date('tgl_sampai');
            $table->time('waktu_mulai');
            $table->time('waktu_selesai');
            $table->string('nomor_nodin')->nullable();
            $table->string('satker_permohonan')->nullable();
            $table->string('lokasi')->nullable();
            $table->string('cp_satker')->nullable();
            $table->string('petugas')->nullable();
            $table->string('peralatan_akun')->nullable();
            $table->string('status')->nullable();
            $table->string('eselon')->nullable();
            $table->string('warna_lokasi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
