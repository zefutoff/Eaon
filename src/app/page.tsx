import ReloadButton from "@/components/ReloadButton";
import UserNameText from "@/components/UserNameDisplay";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ReloadButton
        className="fixed top-3 right-0 bg-transparent"
        iconName="RotateCcw"
      />

      <div className="p-32 text-6xl text-center">
        <p>
          Bienvenue dans tes souvenirs{" "}
          <UserNameText className="font-semibold" /> !
        </p>
      </div>
    </div>
  );
}
