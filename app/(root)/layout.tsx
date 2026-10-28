import Footer from "@/components/shared/footer";
import MediaPlayer from "@/components/shared/media-player";
import Navbar from "@/components/shared/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <Navbar />
      {children}
      <MediaPlayer />
      <Footer />
    </div>
  );
}
