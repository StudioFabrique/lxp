import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import Selecter from "../../../components/UI/selecter/selecter.component";
import bgImage from "../../../assets/images/chaton.jpg";
import NewCourseForm from "../../../components/edit-course/new-course-form";
import useAddLesson from "./use-add-lesson";

function AddNewLesson() {
  const {
    parcoursList,
    modulesList,
    courseList,
    setParcoursId,
    setModuleId,
    setCourseId,
  } = useAddLesson();

  // Image affichée sur la vue sous forme de background-image
  const classImage: React.CSSProperties = {
    backgroundImage: `url('${bgImage}')`,
    width: "100%",
    minHeight: "auto",
    maxHeight: "30rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <FadeWrapper>
      <div className="w-full xl:w-5/6 py-8">
        <Header
          title="Créer une leçon"
          description="Créer une nouvelle leçon associée à un cours"
        />
      </div>
      <div className="xl:w-5/6 grid grid-cols-1 lg:grid-cols-2 gap-16 px-8 mx-auto my-16">
        <div className="grid grid-rows-2 gap-8">
          <div>
            <Wrapper>
              <div className="h-full flex flex-col justify-around gap-y-4">
                <div className="font-bold">
                  Choisissez un parcours, un module et un cours
                </div>
                <div className="flex flex-col gap-y-8">
                  <Selecter
                    list={parcoursList}
                    title="Choisissez un parcours"
                    onSelectItem={setParcoursId}
                  />
                  <Selecter
                    list={modulesList}
                    title="Choisisez un module"
                    onSelectItem={setModuleId}
                  />
                  <Selecter
                    list={courseList}
                    title="Choisisez un cours"
                    onSelectItem={setCourseId}
                  />
                  <NewCourseForm
                    label="Titre de la leçon"
                    isLoading={false}
                    onSubmit={() => {}}
                  />
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
        <div style={classImage} />
      </div>
    </FadeWrapper>
  );
}

export default AddNewLesson;
