import image from "../assets/img.png"

export default function Hero() {
  return (
    <section className="relative">
      
      {/* Image */}
      <img src={image} alt="hero" className="w-full h-screen object-cover" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Welcome to SokkaAI</h1>
        <p className="text-slate-300 mt-2">Your AI powered assistant</p>
      </div>

    </section>
  );
}