<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Teknisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class KegiatanController extends Controller
{
    /**
     * Daftar Kegiatan — Inertia page
     */
    public function index(Request $request)
    {
        $query = Kegiatan::with('teknisi');

        // Filter: search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kegiatan', 'LIKE', "%{$search}%")
                    ->orWhere('nomor_nodin', 'LIKE', "%{$search}%")
                    ->orWhere('satker_permohonan', 'LIKE', "%{$search}%")
                    ->orWhereHas('teknisi', fn($t) => $t->where('name', 'LIKE', "%{$search}%"));
            });
        }

        // Filter: status
        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        // Filter: bulan & tahun
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $query->whereMonth('tgl_dari', $month)
            ->whereYear('tgl_dari', $year);

        // Status counts (untuk badge filter)
        $statusCounts = Kegiatan::whereMonth('tgl_dari', $month)
            ->whereYear('tgl_dari', $year)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $kegiatan = $query->orderBy('tgl_dari', 'desc')
            ->orderBy('waktu_mulai', 'desc')
            ->paginate(15)
            ->withQueryString();

        $filters = $request->only(['search', 'status', 'month', 'year']);

        return Inertia::render('AdminHelpdesk/Tabellaporan', [
            'kegiatan' => $kegiatan,
            'filters' => $filters,
            'statusCounts' => $statusCounts,
        ]);
    }

    /**
     * Kalender Dinas — Inertia page
     */
    public function kalender(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $kegiatan = Kegiatan::with('teknisi')
            ->whereMonth('tgl_dari', $month)
            ->whereYear('tgl_dari', $year)
            ->orderBy('tgl_dari', 'asc')
            ->get();

        // Stats
        $hariTerjadwal = Kegiatan::whereMonth('tgl_dari', $month)
            ->whereYear('tgl_dari', $year)
            ->distinct(DB::raw('DATE(tgl_dari)'))
            ->count(DB::raw('DISTINCT DATE(tgl_dari)'));

        return Inertia::render('AdminHelpdesk/KalenderDinas', [
            'kegiatan' => $kegiatan,
            'hariTerjadwal' => $hariTerjadwal,
            'filters' => $request->only(['month', 'year', 'search']),
        ]);
    }

    /**
     * Store kegiatan baru
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_kegiatan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tgl_dari' => 'required|date',
            'tgl_sampai' => 'required|date|after_or_equal:tgl_dari',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'required',
            'nomor_nodin' => 'nullable|string|max:255',
            'satker_permohonan' => 'nullable|string|max:255',
            'eselon' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'warna_lokasi' => 'nullable|string|max:32',
            'cp_satker' => 'nullable|string|max:255',
            'teknisi_nips' => 'nullable|array',
            'teknisi_nips.*' => 'exists:teknisis,nip',
            'peralatan_akun' => 'nullable|string',
            'status' => 'nullable|string|in:Pending,Done,Mandiri,Batal',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            $data = collect($validator->validated())->except('teknisi_nips')->toArray();
            $kegiatan = Kegiatan::create($data + ['status' => $request->input('status', 'Pending')]);
            $kegiatan->teknisi()->sync($request->input('teknisi_nips', []));

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'data' => $kegiatan->load('teknisi')], 201);
            }
            return redirect()->route('admin.kegiatan.index')->with('success', 'Kegiatan berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
            }
            return back()->withInput()->with('error', 'Gagal menyimpan kegiatan.');
        }
    }

    /**
     * Show detail kegiatan
     */
    public function show($id)
    {
        $kegiatan = Kegiatan::with('teknisi')->findOrFail($id);

        if (request()->expectsJson()) {
            return response()->json(['success' => true, 'data' => $kegiatan]);
        }

        return Inertia::render('AdminHelpdesk/KegiatanDetail', [
            'kegiatan' => $kegiatan,
        ]);
    }

    /**
     * Update kegiatan
     */
    public function update(Request $request, $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nama_kegiatan' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tgl_dari' => 'sometimes|required|date',
            'tgl_sampai' => 'sometimes|required|date|after_or_equal:tgl_dari',
            'waktu_mulai' => 'sometimes|required',
            'waktu_selesai' => 'sometimes|required',
            'nomor_nodin' => 'nullable|string|max:255',
            'satker_permohonan' => 'nullable|string|max:255',
            'eselon' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'warna_lokasi' => 'nullable|string|max:32',
            'cp_satker' => 'nullable|string|max:255',
            'teknisi_nips' => 'nullable|array',
            'teknisi_nips.*' => 'exists:teknisis,nip',
            'peralatan_akun' => 'nullable|string',
            'status' => 'nullable|string|in:Pending,Done,Mandiri,Batal',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            $data = collect($validator->validated())->except('teknisi_nips')->toArray();
            $kegiatan->update($data);
            if ($request->has('teknisi_nips')) {
                $kegiatan->teknisi()->sync($request->input('teknisi_nips', []));
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'data' => $kegiatan->fresh()->load('teknisi')]);
            }
            return redirect()->route('admin.kegiatan.index')->with('success', 'Kegiatan berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
            }
            return back()->withInput()->with('error', 'Gagal mengupdate kegiatan.');
        }
    }

    /**
     * Hapus kegiatan
     */
    public function destroy(Request $request, $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);

        try {
            DB::beginTransaction();
            $kegiatan->delete();
            DB::commit();

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Kegiatan berhasil dihapus.']);
            }
            return back()->with('success', 'Kegiatan berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
            }
            return back()->with('error', 'Gagal menghapus kegiatan.');
        }
    }

    /**
     * Export kegiatan ke Excel
     */
    public function export(Request $request)
    {
        $query = Kegiatan::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kegiatan', 'LIKE', "%{$search}%")
                    ->orWhere('nomor_nodin', 'LIKE', "%{$search}%")
                    ->orWhere('satker_permohonan', 'LIKE', "%{$search}%")
                    ->orWhereHas('teknisi', fn($t) => $t->where('name', 'LIKE', "%{$search}%"));
            });
        }

        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $query->whereMonth('tgl_dari', $month)
            ->whereYear('tgl_dari', $year);

        $kegiatan = $query->with('teknisi')->orderBy('tgl_dari', 'desc')->get();

        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];
        $filename = "Daftar_Kegiatan_{$months[(int)$month]}_{$year}.xlsx";

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\KegiatanExport($kegiatan),
            $filename
        );
    }
}
