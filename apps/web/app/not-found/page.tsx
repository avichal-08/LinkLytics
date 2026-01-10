export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">
        This link either expired or never existed.
      </p>
    </div>
  );
}
