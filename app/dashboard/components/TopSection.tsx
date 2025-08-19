// app/dashboard/components/TopSection.tsx

const TopSection = () => {
  return (
    <section className="flex flex-col items-center justify-center ">
      <div className="w-full rounded-3xl bg-gray-100 p-8 sm:max-w-5xl">
        <h1 className="text-3xl font-bold text-orange-600">
          Welcome to ReRoom AI
        </h1>
        <p className="mt-4 text-gray-600">
          Transform Concepts into Stunning Renders
        </p>
      </div>
    </section>
  );
};

export default TopSection;
