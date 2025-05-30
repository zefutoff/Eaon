import FilterList from "@/components/filters/FilterList";
import FloatingMemoryButton from "@/components/memories/FloatingMemoryButton";
import ReloadButton from "@/components/ReloadButton";
import UserNameText from "@/components/UserNameDisplay";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ReloadButton className="fixed top-1 right-1" iconName="RotateCcw" />

      <div className="p-32 text-6xl text-center">
        <p>
          Bienvenue dans tes souvenirs{" "}
          <UserNameText className="font-semibold" />
        </p>
      </div>
      <FilterList />

      <FloatingMemoryButton />
    </div>
  );
}
