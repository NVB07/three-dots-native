import { RouteDefinition, SheetDefinition, registerSheet } from "react-native-actions-sheet";
import SheetOption from "@/components/blog/SheetOption";
import SheetComments from "@/components/blog/SheetComments";
import NewBlogSheet from "./newBlog/NewBlogSheet";
import EditBlogSheet from "./newBlog/EditBlogSheet";

registerSheet("SheetOption", SheetOption);
registerSheet("SheetComments", SheetComments);
registerSheet("NewBlogSheet", NewBlogSheet);
registerSheet("EditBlogSheet", EditBlogSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
    interface Sheets {
        SheetOption: SheetDefinition;
        SheetComments: SheetDefinition;
        NewBlogSheet: SheetDefinition;
        EditBlogSheet: SheetDefinition;
    }
}

export {};
