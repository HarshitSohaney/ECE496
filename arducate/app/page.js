import ARScene from "../components/ARScene";
import ObjectLibrary from "../components/ObjectLibrary";
import UserSettings from "../components/UserSettings";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        ARducate
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ARScene />
        </div>
        <div>
          <UserSettings />
          <ObjectLibrary />
        </div>
      </div>
    </main>
  );
}
