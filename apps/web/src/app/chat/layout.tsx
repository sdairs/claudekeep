export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
