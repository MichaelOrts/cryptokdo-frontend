import { Button } from "@/components/ui/button"
import PrizePool from "@/components/PrizePool"

export default function Home() {
  return (
    <div className="flex flex-col justify-end">
      <div className="flex flex-row flex-wrap gap-3 m-3 justify-center">
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
        <PrizePool />
      </div>
      <Button>Create Prize Pool</Button>
    </div>
  );
}
