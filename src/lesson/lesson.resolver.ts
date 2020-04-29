import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { LessonType } from './lesson.type';
import { LessonService } from './lesson.service';
import { CreateLessonInput } from './lesson.input';
import { AssignStudentsToLesson } from './assign-students-to-lesson.type';
import { Lesson } from './lesson.entity';
import { StudentService } from '../student/student.service';

@Resolver(of => LessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
  ) {}

  @Query(returns => [LessonType])
  lessons() {
    return this.lessonService.getAllLessons();
  }

  @Query(type => LessonType)
  lesson(@Args('id') id: string) {
    return this.lessonService.getLesson(id);
  }

  @Mutation(returns => LessonType)
  createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ) {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation(returns => LessonType)
  assignStudentsToLesson(
    @Args('assignStudentsToLesson')
    assignStudentsToLessonInput: AssignStudentsToLesson,
  ) {
    const { lessonId, studentsIds } = assignStudentsToLessonInput;
    return this.lessonService.assignStudentsToLesson(lessonId, studentsIds);
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson) {
    return this.studentService.getManyStudents(lesson.students)
  }
}
