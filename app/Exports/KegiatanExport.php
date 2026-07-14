<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class KegiatanExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected $kegiatan;

    public function __construct($kegiatan)
    {
        $this->kegiatan = $kegiatan;
    }

    public function collection()
    {
        return $this->kegiatan;
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Kegiatan',
            'Tanggal Dari',
            'Tanggal Sampai',
            'Waktu Mulai',
            'Waktu Selesai',
            'Nomor Nodin',
            'Satuan Kerja',
            'Eselon',
            'Lokasi',
            'CP Satker',
            'Petugas',
            'Peralatan & Akun',
            'Status',
        ];
    }

    public function map($item): array
    {
        return [
            $item->id,
            $item->nama_kegiatan,
            $item->tgl_dari,
            $item->tgl_sampai,
            $item->waktu_mulai,
            $item->waktu_selesai,
            $item->nomor_nodin ?? '-',
            $item->satker_permohonan ?? '-',
            $item->eselon ?? '-',
            $item->lokasi ?? '-',
            $item->cp_satker ?? '-',
            $item->petugas ?? '-',
            $item->peralatan_akun ?? '-',
            $item->status ?? 'Pending',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'],
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
        ];
    }

    public function title(): string
    {
        return 'Daftar Kegiatan';
    }
}
