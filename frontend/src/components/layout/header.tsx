export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">Genel Bakış</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">Hoşgeldiniz</p>
                    <p className="text-xs text-slate-500">Admin User</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200"></div>
            </div>
        </header>
    );
}
