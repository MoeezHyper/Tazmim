import { SparklesIcon } from "@heroicons/react/24/outline";

type ActionPanelProps = {
  isLoading: boolean;
  submitImage(): void;
};

/**
 * Display the action panel
 * @param {ActionPanelProps} props The component props
 */
export default function ActionPanel({
  isLoading,
  submitImage,
}: ActionPanelProps) {
  const isDisabled = isLoading;

  return (
    <section className="mx-auto mt-[23vh] w-full">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col items-center justify-between gap-3">
          <div className="text-center">
            <h1 className="text-2xl font-bold leading-6 text-[#7f57f1] lg:text-3xl">
              Experience the Magic of AI Remodeling
            </h1>

            <p className="text-sm">
              Transform any room with a click. Select a space, choose a style,
              and watch as AI instantly reimagines your environment.
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <button
              type="button"
              disabled={isDisabled}
              onClick={submitImage}
              className={`${
                isDisabled
                  ? "cursor-not-allowed bg-indigo-300 text-gray-300 hover:bg-indigo-300 hover:text-gray-300"
                  : "bg-indigo-600 text-white"
              } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:px-3.5 lg:py-2.5`}
            >
              Design this room
              <SparklesIcon className="ml-2 h-4 w-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
