import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import useHttp from "../../../hooks/use-http";
import Tag from "../../../utils/interfaces/tag";
import SearchDropdown from "../../UI/search-dropdown/search-dropdown";
import TagItem from "../../UI/tag-item/tag-item";
import Lesson from "../../../utils/interfaces/lesson";
import LessonsTable from "./lessons-table";
import { courseScenarioActions } from "../../../store/redux-toolkit/course/course-scenario";

interface LessonsInDrawerProps {
  onAddNewLessons: (lessonsIds: number[]) => void;
}

const LessonsInDrawer = (props: LessonsInDrawerProps) => {
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const tags = useSelector(
    (state: any) => state.courseInfos.course.tags
  ) as Tag[];
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [lessonsList, setLessonsList] = useState<Lesson[] | null>(null);

  /**
   * gère l'ouverture et la fermeture du drawer
   * @param id string
   */
  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  /**
   * recherche le tag sélectionné dans la liste des tags associés au cours
   * @param name string
   * @param _property string
   */
  const handleSearchTag = (name: string, _property: string) => {
    const selectedTag = tags.find((tag) =>
      tag.name.toLowerCase().includes(name.toLowerCase())
    );
    if (selectedTag) {
      setTag(selectedTag);
    }
  };

  /**
   * recherche les tags correspondant aux infos saisies dans la liste des tags
   * @param name string
   * @param _property string
   */
  const handleFilterTags = (name: string, _property: string) => {
    if (name.length > 0) {
      setFilteredTags(
        tags!.filter((tag) =>
          tag.name.toLowerCase().includes(name.toLowerCase())
        )
      );
    }
  };

  /**
   * reset la recherche
   */
  const handleResetFilter = () => {
    setFilteredTags([]);
  };

  /**
   * ajoputes les leçons sélectionnées ) la liste des leçons du cours
   * @param lessonsIds number[]
   */
  const handleAddLessons = (lessonsIds: number[]) => {
    let updatedLessons = Array<Lesson>();
    lessonsIds.forEach((id) => {
      const lesson = lessonsList!.find((elem) => elem.id === id);
      if (lesson) {
        updatedLessons = [...updatedLessons, lesson];
      }
    });
    console.log("riri", updatedLessons);

    if (updatedLessons.length > 0) {
      props.onAddNewLessons(updatedLessons.map((item) => item.id!));
    }
    dispatch(courseScenarioActions.addManyLessons(updatedLessons));
    handleCloseDrawer("add-lessons");
    setTag(null);
    setLessonsList(null);
  };

  /**
   * retourne la liste des leçons associées au tag choisi par l'utilisateur
   */
  useEffect(() => {
    const applyData = (data: { total: number; data: Lesson[] }) => {
      setLessonsList(data.data);
    };
    if (tag) {
      sendRequest(
        {
          path: `/lesson/tag/${tag.id}`,
        },
        applyData
      );
    }
  }, [tag, sendRequest]);

  // gère les erreurs http
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <RightSideDrawer
      id="add-lessons"
      title="Ajouter des leçons"
      visible={false}
      onCloseDrawer={handleCloseDrawer}
    >
      <div className="flex flex-col gap-y-2">
        <span className="flex flex-col gap-y-4">
          <label htmlFor="tag">
            Saisissez un nom de tag pour trouver les leçons qui lui sont associé
          </label>
          <SearchDropdown
            addItem={handleSearchTag}
            filterItems={handleFilterTags}
            filteredItems={filteredTags}
            resetFilterItems={handleResetFilter}
            property="name"
            placeHolder="Ex : HTML"
          />
        </span>
        {tag ? (
          <>
            <div className="divider" />
            <TagItem tag={tag} />
          </>
        ) : null}
        <div className="divider" />
        {lessonsList && lessonsList.length > 0 ? (
          <LessonsTable
            list={lessonsList}
            onAddItems={handleAddLessons}
            onCloseDrawer={() => {}}
          />
        ) : (
          <p>Aucune leçon trouvée</p>
        )}
      </div>
    </RightSideDrawer>
  );
};
export default LessonsInDrawer;
