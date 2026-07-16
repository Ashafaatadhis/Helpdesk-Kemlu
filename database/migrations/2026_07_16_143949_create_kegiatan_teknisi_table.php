<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kegiatan_teknisi', function (Blueprint $table) {
            $table->unsignedBigInteger('kegiatan_id');
            $table->string('teknisi_nip');
            $table->primary(['kegiatan_id', 'teknisi_nip']);
            $table->foreign('kegiatan_id')->references('id')->on('kegiatan')->onDelete('cascade');
            $table->foreign('teknisi_nip')->references('nip')->on('teknisis')->onDelete('cascade');
        });

        Schema::table('kegiatan', function (Blueprint $table) {
            $table->dropColumn('petugas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan_teknisi');

        Schema::table('kegiatan', function (Blueprint $table) {
            $table->string('petugas')->nullable();
        });
    }
};
