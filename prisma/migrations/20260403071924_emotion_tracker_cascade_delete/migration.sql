-- DropForeignKey
ALTER TABLE "tracker_items" DROP CONSTRAINT "tracker_items_emotionId_fkey";

-- AddForeignKey
ALTER TABLE "tracker_items" ADD CONSTRAINT "tracker_items_emotionId_fkey" FOREIGN KEY ("emotionId") REFERENCES "emotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
