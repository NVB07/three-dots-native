import { RouteDefinition, SheetDefinition, registerSheet } from "react-native-actions-sheet";
import SheetOption from "@/components/blog/SheetOption";
import NewBlogSheet from "./newBlog/NewBlogSheet";
import EditBlogSheet from "./newBlog/EditBlogSheet";
import SearchFriendSheet from "@/components/pages/chatPage/SearchFriendSheet";

registerSheet("SheetOption", SheetOption);
registerSheet("NewBlogSheet", NewBlogSheet);
registerSheet("EditBlogSheet", EditBlogSheet);
registerSheet("SearchFriendSheet", SearchFriendSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
    interface Sheets {
        SheetOption: SheetDefinition;
        NewBlogSheet: SheetDefinition;
        EditBlogSheet: SheetDefinition;
        SearchFriendSheet: SheetDefinition;
    }
}

export {};
