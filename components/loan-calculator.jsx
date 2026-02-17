import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
	Calculator,
	Calendar,
	TrendingUp,
	DollarSign,
	RotateCcw,
	CloudIcon,
} from 'lucide-react'

const fmt = (v) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(v)

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; }
  .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .inp { width:100%; padding:14px 18px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:12px; color:#f1f5f9; font-size:16px; font-family:'Outfit',sans-serif; transition:all 0.3s; outline:none; }
  .inp:focus { background:rgba(255,255,255,0.12); border-color:#60a5fa; box-shadow:0 0 0 3px rgba(96,165,250,0.1); }
  .inp::placeholder { color:rgba(241,245,249,0.4); }
  .btn { padding:12px 28px; border:none; border-radius:12px; font-weight:600; font-size:15px; cursor:pointer; transition:all 0.3s; font-family:'Outfit',sans-serif; display:inline-flex; align-items:center; gap:8px; }
  .btn-blue { background:linear-gradient(135deg,#3b82f6,#2563eb); color:#fff; box-shadow:0 4px 12px rgba(59,130,246,0.3); }
  .btn-blue:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(59,130,246,0.4); }
  .btn-ghost { background:rgba(148,163,184,0.2); color:#cbd5e1; border:1px solid rgba(148,163,184,0.3); }
  .btn-ghost:hover { background:rgba(148,163,184,0.3); }
  .btn-sm { padding:6px 14px; font-size:13px; border-radius:8px; }
  .btn-danger { background:rgba(239,68,68,0.2); color:#fca5a5; border:1px solid rgba(239,68,68,0.3); }
  .btn-danger:hover { background:rgba(239,68,68,0.3); }
  .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; background:rgba(34,197,94,0.2); color:#86efac; border:1px solid rgba(34,197,94,0.3); border-radius:20px; font-size:12px; font-weight:500; }
  .chip-purple { background:rgba(139,92,246,0.2); color:#c4b5fd; border-color:rgba(139,92,246,0.3); }
  .chip-amber { background:rgba(245,158,11,0.2); color:#fcd34d; border-color:rgba(245,158,11,0.3); }
  .stat-card { background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(37,99,235,0.1)); border:1px solid rgba(59,130,246,0.2); border-radius:16px; padding:1.5rem; position:relative; overflow:hidden; }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#3b82f6,#2563eb); }
  .tbl-wrap { overflow-x:auto; border-radius:16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); max-height:600px; overflow-y:auto; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  thead { background:rgba(59,130,246,0.15); position:sticky; top:0; z-index:10; }
  th { padding:14px 10px; text-align:left; font-weight:600; color:#bfdbfe; text-transform:uppercase; font-size:10px; letter-spacing:0.5px; border-bottom:2px solid rgba(59,130,246,0.3); white-space:nowrap; }
  td { padding:12px 10px; color:#e2e8f0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:'JetBrains Mono',monospace; white-space:nowrap; }
  tr:hover td { background:rgba(255,255,255,0.04); }
  tr.disburse td { background:rgba(34,197,94,0.08); }
  tr.row-custom-emi td { background:rgba(139,92,246,0.06); }
  tr.row-lump td { background:rgba(245,158,11,0.08); }
  tfoot td { padding:16px 10px; color:#93c5fd; font-size:13px; font-weight:600; background:rgba(59,130,246,0.1); border-top:2px solid rgba(59,130,246,0.3); }
  .toast { position:fixed; top:20px; right:20px; padding:14px 22px; border-radius:12px; font-weight:600; z-index:1000; animation:slideIn 0.3s ease-out; display:flex; align-items:center; gap:8px; font-size:14px; }
  .toast-save { background:linear-gradient(135deg,#1e40af,#1d4ed8); color:#bfdbfe; box-shadow:0 8px 24px rgba(30,64,175,0.4); }
  .toast-reset { background:linear-gradient(135deg,#374151,#4b5563); color:#e2e8f0; box-shadow:0 8px 24px rgba(0,0,0,0.3); }
  @keyframes slideIn { from { opacity:0; transform:translateX(100px); } to { opacity:1; transform:translateX(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation:fadeUp 0.5s ease-out; }
  label { display:block; color:#cbd5e1; margin-bottom:8px; font-size:14px; font-weight:500; }
  .section-panel { padding:1.5rem; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.08); }
  .section-title { color:#f1f5f9; font-size:1.1rem; font-weight:600; margin:0 0 1rem; display:flex; align-items:center; gap:8px; }
  .tag-pill { display:inline-block; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-left:6px; }
  .save-indicator { display:flex; align-items:center; gap:6px; font-size:12px; color:#64748b; transition:color 0.3s; }
  .save-indicator.saving { color:#60a5fa; }
  .save-indicator.saved { color:#4ade80; }
`

const STORAGE_KEY = 'loan-calc-data'
const DEFAULTS = {
	principal: 100000,
	rate: 7.5,
	years: 20,
	startDate: new Date().toISOString().split('T')[0],
	dispersals: [],
	customEmis: [],
	lumpSums: [],
}

const SmallInp = ({ val, onChange, ...rest }) => (
	<input
		type='number'
		className='inp'
		style={{ padding: '10px 12px', fontSize: 14 }}
		value={val}
		onChange={(e) => onChange(e.target.value)}
		{...rest}
	/>
)

export default function LoanCalculator() {
	const [data, setData] = useState(DEFAULTS)
	const [loaded, setLoaded] = useState(false)
	const [saveStatus, setSaveStatus] = useState('saved') // 'saving' | 'saved'
	const [toast, setToast] = useState(null) // {msg, type}

	const [newDisp, setNewDisp] = useState({ month: 1, pct: 100 })
	const [showDisp, setShowDisp] = useState(false)
	const [newEmi, setNewEmi] = useState({ fromMonth: 1, amount: '' })
	const [showEmi, setShowEmi] = useState(false)
	const [newLump, setNewLump] = useState({ month: 1, amount: '' })
	const [showLump, setShowLump] = useState(false)

	const showToast = (msg, type = 'save') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 2500)
	}

	// Load on mount
	useEffect(() => {
		;(async () => {
			try {
				const res = await window.storage.get(STORAGE_KEY)
				if (res?.value) setData({ ...DEFAULTS, ...JSON.parse(res.value) })
			} catch (_) {
				/* no saved data yet */
			}
			setLoaded(true)
		})()
	}, [])

	// Auto-save whenever data changes (skip initial default before load)
	useEffect(() => {
		if (!loaded) return
		setSaveStatus('saving')
		const t = setTimeout(async () => {
			try {
				await window.storage.set(STORAGE_KEY, JSON.stringify(data))
				setSaveStatus('saved')
			} catch (_) {
				setSaveStatus('saved')
			}
		}, 400) // debounce 400ms
		return () => clearTimeout(t)
	}, [data, loaded])

	const set = (key) => (val) => setData((d) => ({ ...d, [key]: val }))

	const getCustomEmi = (month) => {
		const active = data.customEmis
			.filter((e) => e.fromMonth <= month)
			.sort((a, b) => b.fromMonth - a.fromMonth)[0]
		return active ? active.amount : null
	}
	const getLumpSum = (month) =>
		data.lumpSums.find((l) => l.month === month)?.amount ?? null

	const schedule = useMemo(() => {
		const {
			principal,
			rate,
			years,
			startDate,
			dispersals,
			customEmis,
			lumpSums,
		} = data
		const mRate = rate / 100 / 12
		const totalMonths = years * 12
		const rows = []
		const sortedDisp = [...dispersals].sort((a, b) => a.month - b.month)
		let dispIdx = 0,
			remaining = 0,
			cumDisbursed = 0

		const getCE = (m) => {
			const a = customEmis
				.filter((e) => e.fromMonth <= m)
				.sort((a, b) => b.fromMonth - a.fromMonth)[0]
			return a ? a.amount : null
		}
		const getLS = (m) => lumpSums.find((l) => l.month === m)?.amount ?? null

		for (let m = 1; m <= totalMonths; m++) {
			const d = new Date(startDate)
			d.setMonth(d.getMonth() + m - 1)
			let disbAmt = 0,
				disbPct = 0
			if (dispIdx < sortedDisp.length && sortedDisp[dispIdx].month === m) {
				disbPct = sortedDisp[dispIdx].pct
				disbAmt = (principal * disbPct) / 100
				remaining += disbAmt
				cumDisbursed += disbAmt
				dispIdx++
			}
			if (remaining <= 0) {
				rows.push({
					m,
					date: d.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
					}),
					disbAmt,
					disbPct,
					emi: 0,
					prinPay: 0,
					intPay: 0,
					remaining: 0,
					cumDisbursed,
					payType: 'none',
					stdEmi: 0,
					customEmiAmt: null,
					lumpAmt: null,
				})
				continue
			}

			const remMonths = totalMonths - m + 1
			const stdEmi =
				mRate === 0
					? remaining / remMonths
					: (remaining * mRate * Math.pow(1 + mRate, remMonths)) /
					  (Math.pow(1 + mRate, remMonths) - 1)
			const customEmiAmt = getCE(m),
				lumpAmt = getLS(m)
			const actualEmi = Math.max(stdEmi, customEmiAmt ?? 0, lumpAmt ?? 0)
			let payType = 'std'
			if (lumpAmt !== null && actualEmi === lumpAmt && lumpAmt > stdEmi)
				payType = 'lump'
			else if (customEmiAmt !== null && actualEmi > stdEmi) payType = 'custom'

			const intPay = remaining * mRate
			let prinPay = actualEmi - intPay
			if (prinPay > remaining) prinPay = remaining
			const emi = intPay + prinPay
			remaining = Math.max(0, remaining - prinPay)
			rows.push({
				m,
				date: d.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
				}),
				disbAmt,
				disbPct,
				emi,
				prinPay,
				intPay,
				remaining,
				cumDisbursed,
				payType,
				stdEmi,
				customEmiAmt,
				lumpAmt,
			})

			if (remaining <= 0.01) {
				for (let rest = m + 1; rest <= totalMonths; rest++) {
					const rd = new Date(startDate)
					rd.setMonth(rd.getMonth() + rest - 1)
					rows.push({
						m: rest,
						date: rd.toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
						}),
						disbAmt: 0,
						disbPct: 0,
						emi: 0,
						prinPay: 0,
						intPay: 0,
						remaining: 0,
						cumDisbursed,
						payType: 'none',
						stdEmi: 0,
						customEmiAmt: null,
						lumpAmt: null,
					})
				}
				break
			}
		}
		return rows
	}, [data])

	const totals = useMemo(
		() =>
			schedule.reduce(
				(a, r) => ({
					disbursed: Math.max(a.disbursed, r.cumDisbursed),
					emi: a.emi + r.emi,
					prin: a.prin + r.prinPay,
					int: a.int + r.intPay,
				}),
				{ disbursed: 0, emi: 0, prin: 0, int: 0 },
			),
		[schedule],
	)
	const paidOffMonth = schedule.find((r) => r.remaining <= 0.01 && r.emi > 0)?.m

	const addDispersal = () => {
		if (
			newDisp.month < 1 ||
			newDisp.month > data.years * 12 ||
			newDisp.pct <= 0 ||
			newDisp.pct > 100
		)
			return
		setData((d) => ({
			...d,
			dispersals: [
				...d.dispersals.filter((x) => x.month !== newDisp.month),
				{ ...newDisp },
			],
		}))
		setNewDisp({ month: 1, pct: 100 })
		setShowDisp(false)
	}
	const addCustomEmi = () => {
		const amt = parseFloat(newEmi.amount)
		if (!amt || amt <= 0 || newEmi.fromMonth < 1) return
		setData((d) => ({
			...d,
			customEmis: [
				...d.customEmis.filter((e) => e.fromMonth !== newEmi.fromMonth),
				{ fromMonth: newEmi.fromMonth, amount: amt },
			].sort((a, b) => a.fromMonth - b.fromMonth),
		}))
		setNewEmi({ fromMonth: 1, amount: '' })
		setShowEmi(false)
	}
	const addLumpSum = () => {
		const amt = parseFloat(newLump.amount)
		if (
			!amt ||
			amt <= 0 ||
			newLump.month < 1 ||
			newLump.month > data.years * 12
		)
			return
		setData((d) => ({
			...d,
			lumpSums: [
				...d.lumpSums.filter((l) => l.month !== newLump.month),
				{ month: newLump.month, amount: amt },
			].sort((a, b) => a.month - b.month),
		}))
		setNewLump({ month: 1, amount: '' })
		setShowLump(false)
	}

	const handleReset = async () => {
		setData(DEFAULTS)
		try {
			await window.storage.delete(STORAGE_KEY)
		} catch (_) {}
		showToast('All data cleared', 'reset')
	}

	const rowClass = (r) => {
		if (r.disbAmt > 0) return 'disburse'
		if (r.payType === 'lump') return 'row-lump'
		if (r.payType === 'custom') return 'row-custom-emi'
		return ''
	}

	if (!loaded)
		return (
			<div
				style={{
					minHeight: '100vh',
					background: 'linear-gradient(135deg,#0f172a,#1e293b)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						color: '#60a5fa',
						fontSize: 18,
						fontFamily: 'Outfit,sans-serif',
					}}
				>
					Loading saved data…
				</div>
			</div>
		)

	return (
		<div
			style={{
				minHeight: '100vh',
				background:
					'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%)',
				padding: '3rem 1.5rem',
				fontFamily: '"Outfit",-apple-system,sans-serif',
			}}
		>
			<style>{STYLES}</style>
			{toast && (
				<div className={`toast toast-${toast.type}`}>
					{toast.type === 'save' ? '☁' : '↺'} {toast.msg}
				</div>
			)}

			{/* Header */}
			<div
				style={{ textAlign: 'center', marginBottom: '2.5rem' }}
				className='fade-up'
			>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 12,
						marginBottom: 8,
					}}
				>
					<Calculator size={40} color='#60a5fa' />
					<h1
						style={{
							fontSize: '2.5rem',
							fontWeight: 700,
							margin: 0,
							background: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							letterSpacing: '-0.5px',
						}}
					>
						Loan Amortization Calculator
					</h1>
				</div>
				<p
					style={{
						color: '#94a3b8',
						fontSize: '1.1rem',
						margin: 0,
						fontWeight: 300,
					}}
				>
					Flexible disbursements · Custom EMI · Lump sum payments · Early payoff
					tracking
				</p>
			</div>

			<div style={{ maxWidth: 1400, margin: '0 auto' }}>
				<div
					className='glass fade-up'
					style={{ padding: '2rem', marginBottom: '2rem' }}
				>
					{/* Header row with save indicator */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: '1.5rem',
						}}
					>
						<h2
							style={{
								color: '#f1f5f9',
								fontSize: '1.4rem',
								fontWeight: 600,
								margin: 0,
								display: 'flex',
								alignItems: 'center',
								gap: 10,
							}}
						>
							<DollarSign size={22} color='#60a5fa' /> Loan Parameters
						</h2>
						<div className={`save-indicator ${saveStatus}`}>
							{saveStatus === 'saving' ? (
								<>
									<span
										style={{
											width: 8,
											height: 8,
											borderRadius: '50%',
											background: '#60a5fa',
											display: 'inline-block',
											animation: 'pulse 1s infinite',
										}}
									/>
									Saving…
								</>
							) : (
								<>
									<span
										style={{
											width: 8,
											height: 8,
											borderRadius: '50%',
											background: '#4ade80',
											display: 'inline-block',
										}}
									/>
									All changes saved
								</>
							)}
						</div>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
							gap: '1.5rem',
						}}
					>
						{[
							{
								label: 'Principal Amount ($)',
								key: 'principal',
								min: 1000,
								step: 1000,
							},
							{
								label: 'Interest Rate (% p.a.)',
								key: 'rate',
								min: 0,
								max: 50,
								step: 0.1,
							},
							{ label: 'Tenure (Years)', key: 'years', min: 1, max: 30 },
						].map(({ label, key, ...rest }) => (
							<div key={key}>
								<label>{label}</label>
								<input
									type='number'
									className='inp'
									value={data[key]}
									onChange={(e) =>
										setData((d) => ({ ...d, [key]: Number(e.target.value) }))
									}
									{...rest}
								/>
							</div>
						))}
						<div>
							<label>Start Date</label>
							<input
								type='date'
								className='inp'
								value={data.startDate}
								onChange={(e) =>
									setData((d) => ({ ...d, startDate: e.target.value }))
								}
							/>
						</div>
					</div>

					{/* 3-column panels */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
							gap: '1.5rem',
							marginTop: '2rem',
						}}
					>
						{/* Disbursements */}
						<div className='section-panel'>
							<p className='section-title'>
								<TrendingUp size={18} color='#60a5fa' /> Disbursements
							</p>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: 8,
									marginBottom: data.dispersals.length ? 12 : 0,
								}}
							>
								{[...data.dispersals]
									.sort((a, b) => a.month - b.month)
									.map((d) => (
										<span key={d.month} className='chip'>
											Month {d.month}: {d.pct}%
											<button
												onClick={() =>
													setData((s) => ({
														...s,
														dispersals: s.dispersals.filter(
															(x) => x.month !== d.month,
														),
													}))
												}
												style={{
													background: 'none',
													border: 'none',
													color: '#fca5a5',
													cursor: 'pointer',
													padding: '0 0 0 4px',
													fontSize: 16,
													lineHeight: 1,
												}}
											>
												×
											</button>
										</span>
									))}
							</div>
							{!showDisp ? (
								<button
									className='btn btn-blue btn-sm'
									onClick={() => setShowDisp(true)}
								>
									+ Add
								</button>
							) : (
								<div
									style={{
										display: 'flex',
										gap: 10,
										flexWrap: 'wrap',
										alignItems: 'flex-end',
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') addDispersal()
										if (e.key === 'Escape') setShowDisp(false)
									}}
								>
									<div style={{ flex: 1, minWidth: 90 }}>
										<label style={{ fontSize: 12 }}>Month</label>
										<SmallInp
											val={newDisp.month}
											onChange={(v) => setNewDisp({ ...newDisp, month: +v })}
											min={1}
											max={data.years * 12}
										/>
									</div>
									<div style={{ flex: 1, minWidth: 90 }}>
										<label style={{ fontSize: 12 }}>% of loan</label>
										<SmallInp
											val={newDisp.pct}
											onChange={(v) => setNewDisp({ ...newDisp, pct: +v })}
											min={0.01}
											max={100}
											step={0.01}
										/>
									</div>
									<button
										className='btn btn-blue btn-sm'
										onClick={addDispersal}
									>
										Add
									</button>
									<button
										className='btn btn-danger btn-sm'
										onClick={() => setShowDisp(false)}
									>
										✕
									</button>
								</div>
							)}
						</div>

						{/* Custom EMI */}
						<div
							className='section-panel'
							style={{ borderColor: 'rgba(139,92,246,0.25)' }}
						>
							<p className='section-title' style={{ color: '#c4b5fd' }}>
								<DollarSign size={18} color='#a78bfa' /> Custom EMI
							</p>
							<p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 12px' }}>
								Fixed monthly payment from a given month onwards. Actual =
								max(std EMI, custom EMI).
							</p>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: 8,
									marginBottom: data.customEmis.length ? 12 : 0,
								}}
							>
								{data.customEmis.map((e) => (
									<span key={e.fromMonth} className='chip chip-purple'>
										From M{e.fromMonth}: {fmt(e.amount)}
										<button
											onClick={() =>
												setData((s) => ({
													...s,
													customEmis: s.customEmis.filter(
														(x) => x.fromMonth !== e.fromMonth,
													),
												}))
											}
											style={{
												background: 'none',
												border: 'none',
												color: '#fca5a5',
												cursor: 'pointer',
												padding: '0 0 0 4px',
												fontSize: 16,
												lineHeight: 1,
											}}
										>
											×
										</button>
									</span>
								))}
							</div>
							{!showEmi ? (
								<button
									className='btn btn-sm'
									style={{
										background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
										color: '#fff',
										border: 'none',
									}}
									onClick={() => setShowEmi(true)}
								>
									+ Add
								</button>
							) : (
								<div
									style={{
										display: 'flex',
										gap: 10,
										flexWrap: 'wrap',
										alignItems: 'flex-end',
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') addCustomEmi()
										if (e.key === 'Escape') setShowEmi(false)
									}}
								>
									<div style={{ flex: 1, minWidth: 90 }}>
										<label style={{ fontSize: 12 }}>From Month</label>
										<SmallInp
											val={newEmi.fromMonth}
											onChange={(v) => setNewEmi({ ...newEmi, fromMonth: +v })}
											min={1}
											max={data.years * 12}
										/>
									</div>
									<div style={{ flex: 1, minWidth: 110 }}>
										<label style={{ fontSize: 12 }}>Amount ($)</label>
										<SmallInp
											val={newEmi.amount}
											onChange={(v) => setNewEmi({ ...newEmi, amount: v })}
											min={1}
											step={100}
											placeholder='e.g. 1500'
										/>
									</div>
									<button
										className='btn btn-sm'
										style={{
											background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
											color: '#fff',
											border: 'none',
										}}
										onClick={addCustomEmi}
									>
										Add
									</button>
									<button
										className='btn btn-danger btn-sm'
										onClick={() => setShowEmi(false)}
									>
										✕
									</button>
								</div>
							)}
						</div>

						{/* Lump Sum */}
						<div
							className='section-panel'
							style={{ borderColor: 'rgba(245,158,11,0.25)' }}
						>
							<p className='section-title' style={{ color: '#fcd34d' }}>
								<DollarSign size={18} color='#f59e0b' /> Lump Sum Payment
							</p>
							<p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 12px' }}>
								One-time large payment for a specific month. Actual = max(std
								EMI, custom EMI, lump sum).
							</p>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: 8,
									marginBottom: data.lumpSums.length ? 12 : 0,
								}}
							>
								{data.lumpSums.map((l) => (
									<span key={l.month} className='chip chip-amber'>
										Month {l.month}: {fmt(l.amount)}
										<button
											onClick={() =>
												setData((s) => ({
													...s,
													lumpSums: s.lumpSums.filter(
														(x) => x.month !== l.month,
													),
												}))
											}
											style={{
												background: 'none',
												border: 'none',
												color: '#fca5a5',
												cursor: 'pointer',
												padding: '0 0 0 4px',
												fontSize: 16,
												lineHeight: 1,
											}}
										>
											×
										</button>
									</span>
								))}
							</div>
							{!showLump ? (
								<button
									className='btn btn-sm'
									style={{
										background: 'linear-gradient(135deg,#d97706,#b45309)',
										color: '#fff',
										border: 'none',
									}}
									onClick={() => setShowLump(true)}
								>
									+ Add
								</button>
							) : (
								<div
									style={{
										display: 'flex',
										gap: 10,
										flexWrap: 'wrap',
										alignItems: 'flex-end',
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') addLumpSum()
										if (e.key === 'Escape') setShowLump(false)
									}}
								>
									<div style={{ flex: 1, minWidth: 90 }}>
										<label style={{ fontSize: 12 }}>Month</label>
										<SmallInp
											val={newLump.month}
											onChange={(v) => setNewLump({ ...newLump, month: +v })}
											min={1}
											max={data.years * 12}
										/>
									</div>
									<div style={{ flex: 1, minWidth: 110 }}>
										<label style={{ fontSize: 12 }}>Amount ($)</label>
										<SmallInp
											val={newLump.amount}
											onChange={(v) => setNewLump({ ...newLump, amount: v })}
											min={1}
											step={1000}
											placeholder='e.g. 20000'
										/>
									</div>
									<button
										className='btn btn-sm'
										style={{
											background: 'linear-gradient(135deg,#d97706,#b45309)',
											color: '#fff',
											border: 'none',
										}}
										onClick={addLumpSum}
									>
										Add
									</button>
									<button
										className='btn btn-danger btn-sm'
										onClick={() => setShowLump(false)}
									>
										✕
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Reset only */}
					<div
						style={{
							marginTop: '1.5rem',
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<button className='btn btn-ghost' onClick={handleReset}>
							<RotateCcw size={16} /> Reset All
						</button>
					</div>
				</div>

				{/* Summary */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
						gap: '1.5rem',
						marginBottom: '2rem',
					}}
					className='fade-up'
				>
					{[
						{
							label: 'Total Disbursed',
							val: totals.disbursed,
							color: '#60a5fa',
						},
						{ label: 'Total Interest', val: totals.int, color: '#f59e0b' },
						{
							label: 'Total Principal Paid',
							val: totals.prin,
							color: '#22c55e',
						},
						{
							label: 'Total Amount Payable',
							val: totals.prin + totals.int,
							color: '#a78bfa',
						},
					].map(({ label, val, color }) => (
						<div key={label} className='stat-card'>
							<div
								style={{
									color: '#94a3b8',
									fontSize: 13,
									fontWeight: 500,
									marginBottom: 8,
								}}
							>
								{label}
							</div>
							<div
								style={{
									color,
									fontSize: '1.7rem',
									fontWeight: 700,
									fontFamily: 'JetBrains Mono,monospace',
								}}
							>
								{fmt(val)}
							</div>
						</div>
					))}
				</div>

				{paidOffMonth && paidOffMonth < data.years * 12 && (
					<div
						style={{
							background: 'rgba(34,197,94,0.15)',
							border: '1px solid rgba(34,197,94,0.3)',
							borderRadius: 16,
							padding: '1rem 1.5rem',
							marginBottom: '1.5rem',
							color: '#86efac',
							fontWeight: 600,
							fontSize: 15,
							display: 'flex',
							alignItems: 'center',
							gap: 10,
						}}
					>
						🎉 Loan fully paid off by <strong>Month {paidOffMonth}</strong> —
						that's{' '}
						<strong>{data.years * 12 - paidOffMonth} months early</strong>!
					</div>
				)}

				{/* Table */}
				<div className='glass fade-up' style={{ padding: '2rem' }}>
					<h2
						style={{
							color: '#f1f5f9',
							fontSize: '1.4rem',
							fontWeight: 600,
							marginTop: 0,
							marginBottom: '0.5rem',
							display: 'flex',
							alignItems: 'center',
							gap: 10,
						}}
					>
						<Calendar size={22} color='#60a5fa' /> Amortization Schedule
					</h2>
					<div
						style={{
							display: 'flex',
							gap: 12,
							marginBottom: '1rem',
							flexWrap: 'wrap',
						}}
					>
						<span className='chip'>🟢 Disbursement</span>
						<span className='chip chip-purple'>🟣 Custom EMI active</span>
						<span className='chip chip-amber'>🟡 Lump sum payment</span>
					</div>
					<div className='tbl-wrap'>
						<table>
							<thead>
								<tr>
									<th>Month</th>
									<th>Date</th>
									<th>Disbursement</th>
									<th>EMI Paid</th>
									<th>Std. EMI</th>
									<th>Custom EMI</th>
									<th>Lump Sum</th>
									<th>Principal</th>
									<th>Interest</th>
									<th>Balance</th>
								</tr>
							</thead>
							<tbody>
								{schedule.map((r) => (
									<tr key={r.m} className={rowClass(r)}>
										<td>
											{r.m}
											{r.payType === 'lump' && (
												<span
													className='tag-pill'
													style={{
														background: 'rgba(245,158,11,0.3)',
														color: '#fcd34d',
													}}
												>
													LUMP
												</span>
											)}
											{r.payType === 'custom' && (
												<span
													className='tag-pill'
													style={{
														background: 'rgba(139,92,246,0.3)',
														color: '#c4b5fd',
													}}
												>
													CEMI
												</span>
											)}
										</td>
										<td>{r.date}</td>
										<td
											style={{ color: r.disbAmt > 0 ? '#86efac' : '#475569' }}
										>
											{r.disbAmt > 0
												? `${fmt(r.disbAmt)} (${r.disbPct}%)`
												: '—'}
										</td>
										<td
											style={{
												color:
													r.payType === 'lump'
														? '#fcd34d'
														: r.payType === 'custom'
														? '#c4b5fd'
														: '#e2e8f0',
												fontWeight: r.payType !== 'std' ? 600 : 400,
											}}
										>
											{r.emi > 0 ? fmt(r.emi) : '—'}
										</td>
										<td style={{ color: '#94a3b8' }}>
											{r.stdEmi > 0 ? fmt(r.stdEmi) : '—'}
										</td>
										<td
											style={{ color: r.customEmiAmt ? '#c4b5fd' : '#475569' }}
										>
											{r.customEmiAmt ? fmt(r.customEmiAmt) : '—'}
										</td>
										<td style={{ color: r.lumpAmt ? '#fcd34d' : '#475569' }}>
											{r.lumpAmt ? fmt(r.lumpAmt) : '—'}
										</td>
										<td style={{ color: '#86efac' }}>
											{r.prinPay > 0 ? fmt(r.prinPay) : '—'}
										</td>
										<td style={{ color: '#fbbf24' }}>
											{r.intPay > 0 ? fmt(r.intPay) : '—'}
										</td>
										<td
											style={{
												color: r.remaining < 1 ? '#86efac' : '#e2e8f0',
												fontWeight: r.remaining < 1 ? 700 : 400,
											}}
										>
											{fmt(r.remaining)}
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr>
									<td colSpan={3}>TOTALS</td>
									<td>{fmt(totals.emi)}</td>
									<td colSpan={3}></td>
									<td style={{ color: '#86efac' }}>{fmt(totals.prin)}</td>
									<td style={{ color: '#fbbf24' }}>{fmt(totals.int)}</td>
									<td>—</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}
