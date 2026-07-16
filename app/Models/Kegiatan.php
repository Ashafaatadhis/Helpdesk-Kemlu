<?php

namespace App\Models;

use App\Models\Teknisi;
use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    protected $table = 'kegiatan';
    protected $fillable = [
        'nama_kegiatan',
        'deskripsi',
        'tgl_dari',
        'tgl_sampai',
        'waktu_mulai',
        'waktu_selesai',
        'nomor_nodin',
        'satker_permohonan',
        'lokasi',
        'cp_satker',
        'peralatan_akun',
        'status',
        'eselon',
        'warna_lokasi',
    ];

    protected $casts = [
        // date di-set manual biar format Y-m-d cocok untuk input[type=date]
    ];

    public function getTglDariAttribute($value): ?string
    {
        return $value ? date('Y-m-d', strtotime($value)) : null;
    }

    public function getTglSampaiAttribute($value): ?string
    {
        return $value ? date('Y-m-d', strtotime($value)) : null;
    }

    /**
     * Get petugas as array (split from comma-separated string)
     */
    public function teknisi()
    {
        return $this->belongsToMany(Teknisi::class, 'kegiatan_teknisi', 'kegiatan_id', 'teknisi_nip', 'id', 'nip');
    }
}
