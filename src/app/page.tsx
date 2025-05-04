import ReloadButton from "@/components/ReloadButton";
import UserNameText from "@/components/UserNameDisplay";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-blue-600">
      <ReloadButton className="fixed top-4 right-4 z-10" />

      <div className="pt-16 px-4 text-xl text-white text-center">
        <p>
          Bienvenue dans tes souvenirs <UserNameText /> !
        </p>
      </div>
    </div>
  );
}
