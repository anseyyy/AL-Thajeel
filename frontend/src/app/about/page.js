import AboutHead from "@/components/about/AboutHead";
import HowWeWork from "@/components/about/HowWeWork";

export const metadata = {
  title: "About Us — Al Dhiyafah Properties",
  description:
    "A UAE-based brokerage working across Dubai, Abu Dhabi and Sharjah since 2014.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHead />
      <HowWeWork />
    </>
  );
}
