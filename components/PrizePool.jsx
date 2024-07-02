import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
  

const PrizePool = ({a}) => {
    return (
        <Card className="bg-gradient-to-b from-blue-500 to-purple-500">
            <CardHeader>
                <CardTitle>Prize Pool</CardTitle>
                <CardDescription>Prize Pool Description</CardDescription>
            </CardHeader>
            <CardContent className="gap-5">
                <div className="font-bold">Owner</div>
                <div className="text-right">0x4751b31f47a6c71f6a2a</div>
                <div className="font-bold">Receiver</div>
                <div className="text-right">0x4751b31f47a6c71f6a2a</div>
                <div className="font-bold">Givers</div>
                <div className="text-right">0x4751b31f47a6c71f6a2a</div>
                <div className="text-right">0x4751b31f47a6c71f6a2a</div>
                <div className="font-bold">Amount</div>
                <div className="text-right">500</div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 flex-wrap">
                <Button className="w-full">Donate</Button>
                <Button className="w-full">Close</Button>
            </CardFooter>
        </Card>
    );
  }
  
  export default PrizePool;
  