import { Button } from "@/components/ui/button";
import PublicationSummaryGenerator from "@/components/blocks/publication-summary-generator";

export default function Home() {
  return (
		<div className="flex flex-col space-y-6 my-4 w-full">
			<PublicationSummaryGenerator />
		</div>
	);
}
