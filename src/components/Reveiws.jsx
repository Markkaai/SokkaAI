import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Developer",
    avatar: "A",
    rating: 5,
    review: "SokkaAI has completely transformed how I write code. The suggestions are incredibly accurate and save me hours every day!",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Sarah Kimani",
    role: "Data Scientist",
    avatar: "S",
    rating: 5,
    review: "The AI capabilities are outstanding. I use it daily for data analysis and it never disappoints. Highly recommended!",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    name: "James Ochieng",
    role: "Student",
    avatar: "J",
    rating: 4,
    review: "As a student, SokkaAI has been a game changer for research and essay writing. It's like having a personal tutor 24/7.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 4,
    name: "Amina Hassan",
    role: "Content Creator",
    avatar: "A",
    rating: 5,
    review: "I create content faster than ever with SokkaAI. It understands my style and helps me stay consistent across all platforms.",
    color: "from-green-500 to-green-600",
  },
  {
    id: 5,
    name: "Brian Mutua",
    role: "Entrepreneur",
    avatar: "B",
    rating: 5,
    review: "From business plans to marketing copy, SokkaAI does it all. It's like having an entire team in one tool.",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 6,
    name: "Linda Wanjiru",
    role: "Teacher",
    avatar: "L",
    rating: 4,
    review: "I use SokkaAI to prepare lesson plans and quizzes. It saves me so much time and the quality is always impressive.",
    color: "from-pink-500 to-pink-600",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= rating ? "text-yellow-400" : "text-slate-600"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  const next = () => setActive((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));

  return (
    <section className="bg-slate-900 py-20 px-4">

      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-white mb-3">
          What Our <span className="text-blue-400">Users</span> Say
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Thousands of people trust SokkaAI every day. Here's what they think.
        </p>
      </div>

      {/* Featured Review - Large */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative bg-black/50 backdrop-blur-md border border-blue-500/30 
                        rounded-2xl px-8 py-10 shadow-2xl shadow-blue-500/10 text-center
                        transition-all duration-500">

          {/* Quote Icon */}
          <div className="text-6xl text-blue-500/20 font-serif absolute top-4 left-6">"</div>

          {/* Avatar */}
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${reviews[active].color} 
                          flex items-center justify-center text-2xl font-bold mx-auto mb-4
                          shadow-lg`}>
            {reviews[active].avatar}
          </div>

          {/* Stars */}
          <div className="flex justify-center mb-4">
            <StarRating rating={reviews[active].rating} />
          </div>

          {/* Review Text */}
          <p className="text-slate-300 text-lg leading-relaxed mb-6 italic">
            "{reviews[active].review}"
          </p>

          {/* Name */}
          <p className="text-white font-bold">{reviews[active].name}</p>
          <p className="text-slate-500 text-sm">{reviews[active].role}</p>

          {/* Nav Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-blue-500/40 text-blue-400
                         hover:bg-blue-500/20 transition-all duration-300 active:scale-95"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-blue-500/40 text-blue-400
                         hover:bg-blue-500/20 transition-all duration-300 active:scale-95"
            >
              →
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 
                           ${i === active
                             ? "bg-blue-400 w-6"
                             : "bg-slate-600 w-2 hover:bg-slate-400"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid of All Reviews */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <div
            key={review.id}
            onClick={() => setActive(i)}
            className={`bg-black/40 backdrop-blur-md border rounded-xl px-6 py-6 
                       cursor-pointer transition-all duration-300 hover:scale-105
                       hover:shadow-lg
                       ${i === active
                         ? "border-blue-500/60 shadow-blue-500/20 shadow-lg"
                         : "border-slate-700/50 hover:border-blue-500/30"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${review.color} 
                              flex items-center justify-center font-bold text-sm`}>
                {review.avatar}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{review.name}</p>
                <p className="text-slate-500 text-xs">{review.role}</p>
              </div>
              <div className="ml-auto">
                <StarRating rating={review.rating} />
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
              "{review.review}"
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6 text-center">
        {[
          { value: "10K+", label: "Happy Users" },
          { value: "4.9★", label: "Average Rating" },
          { value: "99%", label: "Satisfaction Rate" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-black/40 border border-blue-500/20 rounded-xl py-6
                       hover:border-blue-500/50 transition-all duration-300"
          >
            <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

    </section>
  );
}